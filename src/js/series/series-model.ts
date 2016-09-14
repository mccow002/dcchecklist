import { IIssue } from '../issues/issue-model';

export interface ISeries {
    _id: string,
    _type: string,
    Name: string,
    Volume: Number,
    NumberOfIssues: Number,
    SeriesType: string,
    StartDate: Date,
    EndDate: Date,
    Issues: Array<IIssue>
}

export class Series implements ISeries {
    _id: string;
    _type: string;
    Name: string;
    Volume: Number;
    NumberOfIssues: Number;
    SeriesType: string;
    StartDate: Date;
    EndDate: Date;
    Issues: Array<IIssue>;

    constructor(name: string, volume: number) {
        this.Name = name;
        this.Volume = volume;
        this.Issues = new Array<IIssue>();
    }

}