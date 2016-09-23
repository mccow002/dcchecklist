import * as express from 'express';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as q from 'q';
import * as _ from 'lodash';
import * as path from 'path';
import { Series, ISeries } from '../models/series';
import { Issue, IIssue } from '../models/issue';
import { Config } from '../config';
import { SeriesService, ISeriesService } from '../services/SeriesService';

class SeriesApi {

    public GetAll(req: express.Request, res: express.Response){
        let _seriesService = new SeriesService();
        _seriesService.GetAll()
            .then((series: ISeries[]) => res.json(series))
            .catch((reason: string) => res.json(500, reason));
    }

    public GetOne(req: express.Request, res: express.Response) {
        let _seriesService = new SeriesService();

        var seriesId = req.params.id;
        _seriesService.GetOne(seriesId)
            .then((result: ISeries) => res.json(result))
            .catch((reason: string) => res.json(500, reason));
    }

    public CreateSeries(req: express.Request, res: express.Response) {
        let _seriesService = new SeriesService();

        var series = <ISeries>req.body;
        _seriesService.CreateSeries(series)
            .then((result: ISeries) => res.json(result))
            .catch((reason: string) => res.json(500, reason));   
    }

    LinkPrevious(req: express.Request, res: express.Response) {
        var body = <ICreateSeriesLink> req.body;
        Series.findById(body.SeriesId, (err: mongoose.Error, result: ISeries) => {
            result.PreviousSeries = body.SeriesToLink;
            Series.findByIdAndUpdate(body.SeriesId, result, (err: mongoose.Error, updatedSeries: ISeries) => {
                res.json(updatedSeries);
            })
        });
    }

    LinkNext(req: express.Request, res: express.Response) {
        var body = <ICreateSeriesLink> req.body;
        Series.findById(body.SeriesId, (err: mongoose.Error, result: ISeries) => {
            result.NextSeries = body.SeriesToLink;
            Series.findByIdAndUpdate(body.SeriesId, result, (err: mongoose.Error, updatedSeries: ISeries) => {
                res.json(updatedSeries);
            })
        });
    }

    public GetFilesInDir(req: express.Request, res: express.Response) {
        let dir = req.body;
        console.log(dir);

        let d = q.defer();
        fs.stat(dir.folder, (err, stat) => {
            if(err === null) {
                d.resolve();
            } else {
                d.reject(err);
            }
        });

        d.promise.then(() => {
                fs.readdir(dir.folder, (err: NodeJS.ErrnoException, files: string[]) => {
                    res.json(files);
                });
            }, 
            () => {
                res.json(404);
        });
    }

    public LinkToFolder(req: express.Request, res: express.Response) {
        var info = <ILinkToFolderReq>req.body;
        var reg = () => /[0-9]{3}/;
        var match = reg().exec(info.FilePattern);
        var numIndex = info.FilePattern.indexOf(match[0]);
        var prefix = info.FilePattern.substring(0, numIndex).trim();

        var scanReg = () => /^(.*?)[0-9]{3}/;
        var issueNumReg = () => /^[0-9]{3}/;
        fs.readdir(info.FolderPath, 
            (err: NodeJS.ErrnoException, files: string[]) => {
                let filteredFiles = new Array<any>();
                files.forEach((file) => {
                    var result  = scanReg().exec(file);

                    var fileStart = result[1].trim();
                    if(fileStart === prefix) {
                        var startStrippedOff = file.substring(result[1].length, file.length);
                        var num = issueNumReg().exec(startStrippedOff);

                        filteredFiles.push({
                            fileName: file,
                            fileNumber: Number(num[0])   
                        });
                    }
                });
                
                var issues = info.Series.Issues;
                for(let i = 0; i < issues.length; i++) {
                    var match = _.find(filteredFiles, (f: any) => f.fileNumber == issues[i].Number);
                    if(match === undefined) {
                        continue;
                    }
                    issues[i].FilePath = path.join(info.FolderPath, match.fileName);
                }

                var promises = new Array<q.IPromise<IIssue>>();
                issues.forEach(i => {
                    var d = q.defer();
                    Issue.findByIdAndUpdate(i._id, i, (err, issue) => {
                        d.resolve();
                    });
                    promises.push(d.promise);
                });

                q.allSettled(promises)
                    .then(() => {
                        Series.findOne({ _id: info.Series._id })
                            .populate('Issues')
                            .exec((err: mongoose.Error, result: ISeries) => {
                                if(err) throw err;
                                res.json(result);
                            });
                    });
            });
    }

    public DeleteSeries(req: express.Request, res: express.Response) {
        let _seriesService = new SeriesService();

        var id = req.params.id;
        _seriesService.DeleteSeries(id)
            .then(() => res.json(200))
            .catch((reason: string) => res.json(500, reason));
    }

    public MergeSeries(req: express.Request, res: express.Response) {
        let _seriesService = new SeriesService();

        let mergeReq = <IMergeSeriesReq> req.body;
        
        let baseQ = Series.findById(mergeReq.BaseSeriesId);
        let mergeQ = Series.findById(mergeReq.MergeSeriesId);

        q.allSettled([baseQ, mergeQ])
            .then((result: q.PromiseState<ISeries>[]) => {
                let baseSeries = result[0].value;
                _.forEach(result[1].value.Issues, (i: any) => {
                    baseSeries.Issues.push(i);
                });

                return Series.findByIdAndUpdate(baseSeries._id, baseSeries);
            })
            .then((result: ISeries) => {
                let d = q.defer();
                Series.findByIdAndRemove(mergeReq.MergeSeriesId)
                    .then(() => d.resolve(result));
                return d.promise;
            })
            .then((result: ISeries) => {
                res.json(result);
            })
            .catch((reason: string) => res.json(500, reason));
    }

}

interface ILinkToFolderReq {
    Series: ISeries,
    FolderPath: string,
    FilePattern: string
}

interface ICreateSeriesLink {
    SeriesId: string,
    SeriesToLink: any
}

interface IMergeSeriesReq {
    BaseSeriesId: string,
    MergeSeriesId: string
}

let seriesApi = new SeriesApi();
let router = express.Router();
router.post('/create', seriesApi.CreateSeries);
router.get('/', seriesApi.GetAll);
router.get('/:id', seriesApi.GetOne);
router.post('/getfilesindir/', seriesApi.GetFilesInDir);
router.post('/linkToFolder', seriesApi.LinkToFolder);
router.delete('/:id', seriesApi.DeleteSeries);
router.put('/linkprevious/', seriesApi.LinkPrevious);
router.put('/linknext/', seriesApi.LinkNext);
router.put('/mergeseries', seriesApi.MergeSeries);

module.exports = router;