import * as express from 'express';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as q from 'q';
import * as _ from 'lodash';
import * as path from 'path';
import { Series, ISeries } from '../models/series';
import { Issue, IIssue } from '../models/issue';
import { Config } from '../config'

class SeriesApi {

    constructor() {
        //mongoose.connect(Config.DbConnection);
    }

    public GetAll(req: express.Request, res: express.Response){
        Series.find({ _type: 'series' }, (err: mongoose.Error, results: ISeries[]) => {
            if(err) throw err;
            res.json(results);
        })
    }

    public GetOne(req: express.Request, res: express.Response) {
        var seriesId = req.params.id;
        Series.findOne({ _id: seriesId })
            .populate('Issues')
            .exec((err: mongoose.Error, result: ISeries) => {
                if(err) throw err;
                res.json(result);
            });
    }

    public CreateSeries(req: express.Request, res: express.Response) {
        var series = req.body;

        let issues = new Array<IIssue>()
        for(let i = 0; i < series.Issues.length; i++) {
            let issue = new Issue();
            issue._type = "issue";
            issue.Number = series.Issues[i].Number
            issues.push(issue);
        }

        Issue.insertMany(issues, (err: mongoose.Error, results: IIssue[]) => {
            if(err) throw err;
            console.log(results);

            let seriesObj = new Series();
            seriesObj._type = "series";
            seriesObj.Name = series.Name
            seriesObj.Volume = series.Volume;
            seriesObj.StartDate = series.StartDate;
            seriesObj.EndDate = series.EndDate;

            if(series.SeriesType !== ''){
                seriesObj.SeriesType = series.SeriesType;
            }

            seriesObj.Issues = new Array<IIssue>();
            console.log(seriesObj);
            for(let i = 0; i < results.length; i++) {
                seriesObj.Issues.push(results[i]._id);
            }

            Series.create(seriesObj, (err: mongoose.Error, result: ISeries) => {
                if(err) throw err;
                res.json(200);
            });
        })
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
        fs.readdir(info.FolderPath, 
            (err: NodeJS.ErrnoException, files: string[]) => {
                var filteredFiles = _.filter(files, (file) => {
                    var result  = scanReg().exec(file);
                    var fileStart = result[1].trim();
                    if(fileStart === prefix) {
                        return file;
                    }
                });

                var issues = _.orderBy(info.Series.Issues, ['IssueNumber']);
                for(let i = 0; i < issues.length; i++) {
                    issues[i].FilePath = path.join(info.FolderPath, filteredFiles[i]);
                }

                var promises = new Array<q.IPromise<IIssue>>();
                issues.forEach(i => {
                    var d = q.defer();
                    Issue.findByIdAndUpdate(i._id, i, (err, issue) => {
                        d.resolve();
                    });
                    promises.push(d.promise);
                });

                q.allResolved(promises)
                    .then(() => {
                        Series.findOne({ _id: info.Series._id })
                            .populate('Issues')
                            .exec((err: mongoose.Error, result: ISeries) => {
                                if(err) throw err;
                                res.json(result);
                            });
                    })
            });

        // var result  = scanReg().exec(files[i]);
        // var fileStart = result[1];

        // if(fileStart === prefix) {
            
        // }
    }

}

interface ILinkToFolderReq {
    Series: ISeries,
    FolderPath: string,
    FilePattern: string
}

let seriesApi = new SeriesApi();
let router = express.Router();
router.post('/create', seriesApi.CreateSeries);
router.get('/', seriesApi.GetAll);
router.get('/:id', seriesApi.GetOne);
router.post('/getfilesindir/', seriesApi.GetFilesInDir);
router.post('/linkToFolder', seriesApi.LinkToFolder);

module.exports = router;