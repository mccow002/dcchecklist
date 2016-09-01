export interface IIssue {
    _type: String,
    Number: Number,
    Title: String
}

export class Issue implements IIssue {
    _type: String;
    Number: Number;
    Title: String;

    constructor(number: number) {
        this.Number = number;
    }
}