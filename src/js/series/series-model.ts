import { IIssue } from './issue-model';

export interface ISeries {
    _type: String,
    Name: String,
    Volume: Number,
    NumberOfIssues: Number,
    Issues: Array<IIssue>
}

export class Series implements ISeries {
    _type: String;
    Name: String;
    Volume: Number;
    NumberOfIssues: Number;
    Issues: Array<IIssue>;

    constructor(name: string, volume: number) {
        this.Name = name;
        this.Volume = volume;
        this.Issues = new Array<IIssue>();
    }

}