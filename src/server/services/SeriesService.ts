import * as q from 'q';
import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import { Series, ISeries } from '../models/series';
import { Issue, IIssue } from '../models/issue';

export interface ISeriesService {
    GetAll(): Promise<ISeries[]>,
    GetOne(seriesId: string): Promise<ISeries>,
    CreateSeries(series: ISeries): Promise<ISeries>,
    DeleteSeries(seriesId: string): Promise<ISeries>
}

export class SeriesService implements ISeriesService {

    public GetAll(): Promise<ISeries[]> {
        return Series.find({ _type: 'series' });
    }

    public GetOne(seriesId: string): Promise<ISeries> {
        return Series.findOne({ _id: seriesId })
            .populate('Issues')
            .exec();
    }

    public CreateSeries(series: ISeries): Promise<ISeries> {
        let issues = new Array<IIssue>()
        for(let i = 0; i < series.Issues.length; i++) {
            let issue = new Issue();
            issue._type = "issue";
            issue.Number = series.Issues[i].Number;

            if(series.SeriesType) {
                issue.Type = series.SeriesType;
            }

            issues.push(issue);
        }

        return Issue.insertMany(issues)
            .then((issues: IIssue[]) => {
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
                for(let i = 0; i < issues.length; i++) {
                    seriesObj.Issues.push(issues[i]._id);
                }

                 return Series.create(seriesObj);
            });
    }

    public DeleteSeries(seriesId: string): Promise<ISeries> {
        return Series.findById(seriesId)
            .then((result: ISeries) => {
                var promises = new Array<q.IPromise<IIssue>>();
                result.Issues.forEach(i => {
                    var d = q.defer();
                    Issue.findByIdAndRemove(i, () => d.resolve());
                    promises.push(d.promise);
                });

                return q.allSettled(promises)
                    .then(() => {
                        return Series.findByIdAndRemove(seriesId);
                    });
            });
    }

}