import * as express from 'express';
import * as mongoose from 'mongoose';
import { Series, ISeries } from '../models/series';
import { Issue, IIssue } from '../models/issue';
import { Config } from '../config'

class SeriesApi {

    constructor() {
        //mongoose.connect(Config.DbConnection);
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

}

let seriesApi = new SeriesApi();
let router = express.Router();
router.post('/create', seriesApi.CreateSeries);

module.exports = router;