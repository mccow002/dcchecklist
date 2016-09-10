import { IPublication } from '../publications/publication-model';

export interface IParseIssueResult {
    Success: boolean,
    First: number,
    Last: number
}

export interface IParseDateResult {
    Success: boolean,
    Start: Date,
    End: Date
}

export class ParseSeries {
    
    IssueParsers: Array<IIssueParser>;
    DateParsers: Array<IDateParser>;

    constructor() {
        this.IssueParsers = new Array<IIssueParser>();
        this.IssueParsers.push(new RangeParser());
        this.IssueParsers.push(new SingleIssueParser());
        this.IssueParsers.push(new SpecialCaseParser());

        this.DateParsers = new Array<IDateParser>();
        this.DateParsers.push(new MonthAndYearRange());
        this.DateParsers.push(new MonthRange());
        this.DateParsers.push(new SingleMonth());
    }

    public ParseIssues(pub: IPublication): IParseIssueResult {
        for(let i = 0; i < this.IssueParsers.length; i++){
            var r = this.IssueParsers[i].Parse(pub);
            if(!r.Success)
                continue;

            return r;
        }

        return new ParseIssueResult();
    }

    public ParseDate(pub: IPublication): IParseDateResult {
        for(let i = 0; i < this.DateParsers.length; i++){
            var r = this.DateParsers[i].Parse(pub);
            if(!r.Success)
                continue;

            return r;
        }

        return new ParseDateResult();
    }
}

class ParseIssueResult implements IParseIssueResult {

    constructor(first: number = null, last: number = null) {
        this.First = first;
        this.Last = last;
        this.Success = first !== null;
    }

    Success: boolean;
    First: number;
    Last: number;
}

class ParseDateResult implements IParseDateResult {

    constructor(start: Date = null, end: Date = null) {
        this.Start = start;
        this.End = end;
        this.Success = start !== null;
    }

    Success: boolean;
    Start: Date;
    End: Date;
}

interface IIssueParser {
    Parse(pub: IPublication): IParseIssueResult
}

class RangeParser implements IIssueParser {
    Parse(pub: IPublication): IParseIssueResult {
        let regex = () => new RegExp('#[0-9]+\-[0-9]+', 'g');
        if(!regex().test(pub.Issues)){
            return new ParseIssueResult();
        }

        let r = regex().exec(pub.Issues);
        let str = r[0].replace(/#/g, '');
        var parts = str.split('-');
        return new ParseIssueResult(Number(parts[0]), Number(parts[1]));
    }
}

class SingleIssueParser implements IIssueParser {
    Parse(pub: IPublication): IParseIssueResult {
        let regex = () => new RegExp('#[0-9]+', 'g');
        if(!regex().test(pub.Issues)){
            return new ParseIssueResult();
        }

        let r = regex().exec(pub.Issues);
        let str = r[0].replace(/#/g, '');
        return new ParseIssueResult(1, 1);
    }
}

class SpecialCaseParser implements IIssueParser {
    Parse(pub: IPublication): IParseIssueResult {
        let gnReg = new RegExp('graphic novel', 'i');
        if(gnReg.test(pub.Notes)){
            return new ParseIssueResult(1, 1);
        }

        let osReg = new RegExp('one[-]?[\s]?shot', 'i');
        if(osReg.test(pub.Notes)){
            return new ParseIssueResult(1, 1);
        }

        return new ParseIssueResult();
    }
}

interface IDateParser {
    Parse(pub: IPublication): IParseDateResult
}

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class MonthAndYearRange implements IDateParser {
    Parse(pub: IPublication): IParseDateResult {
        if(pub.Dates.indexOf('-') < 0 && pub.Dates.indexOf('–') < 0)
            return new ParseDateResult();
        
        var regex = () => /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)+[\s]*[0-9]{4}/ig;

        let parts = new Array<string>();
        if(pub.Dates.indexOf('-') > 0)
            parts = pub.Dates.split('-');
        else
            parts = pub.Dates.split('–');

        parts[0] = parts[0].trim();
        parts[1] = parts[1].trim();

        var startTest = regex().test(parts[0]);
        var endTest = regex().test(parts[1]);

        if(!startTest || !endTest){
            return new ParseDateResult();
        }

        var parse = (index: number): Date => {
            var r = regex().exec(parts[index]);
            var dateParts = r[0].split(' ');
            return new Date(Number(dateParts[1]), Months.indexOf(dateParts[0]));
        }

        return new ParseDateResult(parse(0), parse(1));
    }
}

class MonthRange implements IDateParser {
    Parse(pub: IPublication): IParseDateResult {
        if(pub.Dates.indexOf('-') < 0 && pub.Dates.indexOf('–') < 0)
            return new ParseDateResult();

        var startRegex = () => /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)+$/i;
        var endRegex = () => /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)+[\s]*[0-9]{4}/ig;

        let parts = new Array<string>();
        if(pub.Dates.indexOf('-') > 0)
            parts = pub.Dates.split('-');
        else
            parts = pub.Dates.split('–');

        parts[0] = parts[0].trim();
        parts[1] = parts[1].trim();

        var startTest = startRegex().test(parts[0]);
        var endTest = endRegex().test(parts[1]);

        if(!startTest || !endTest){
            return new ParseDateResult();
        }

        var endParts = parts[1].split(' ');
        return new ParseDateResult(new Date(Number(endParts[1]), Months.indexOf(parts[0])), new Date(Number(endParts[1]), Months.indexOf(endParts[0])));
    }
}

class SingleMonth implements IDateParser {
    Parse(pub: IPublication): IParseDateResult {
        var regex = () => /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)+[\s]*[0-9]{4}$/ig;
        if(!regex().test(pub.Dates))
            return new ParseDateResult();

        let parts = pub.Dates.split(' ');
        var date = new Date(Number(parts[1]), Months.indexOf(parts[0]));
        return new ParseDateResult(date, date);
    }
}