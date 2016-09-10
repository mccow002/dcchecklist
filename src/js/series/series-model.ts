import { IIssue } from '../issues/issue-model';

export interface ISeries {
    _id: String,
    _type: String,
    Name: String,
    Volume: Number,
    NumberOfIssues: Number,
    SeriesType: String,
    StartDate: Date,
    EndDate: Date,
    Issues: Array<IIssue>
}

export class Series implements ISeries {
    _id: String;
    _type: String;
    Name: String;
    Volume: Number;
    NumberOfIssues: Number;
    SeriesType: String;
    StartDate: Date;
    EndDate: Date;
    Issues: Array<IIssue>;

    constructor(name: string, volume: number) {
        this.Name = name;
        this.Volume = volume;
        this.Issues = new Array<IIssue>();
    }

}