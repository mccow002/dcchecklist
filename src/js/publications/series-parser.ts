import { IPublication } from './publication-model';

export interface IParseResult {
    Success: boolean,
    First: number,
    Last: number
}

export class ParseSeries {
    
    parsers: Array<IParser>;

    constructor() {
        this.parsers = new Array<IParser>();
        this.parsers.push(new RangeParser());
        this.parsers.push(new SingleIssueParser());
        this.parsers.push(new SpecialCaseParser());
    }

    public Parse(pub: IPublication): IParseResult {
        for(let i = 0; i < this.parsers.length; i++){
            var r = this.parsers[i].Parse(pub);
            if(!r.Success)
                continue;

            return r;
        }

        return new ParseResult();
    }
}

class ParseResult implements IParseResult {

    constructor(first: number = null, last: number = null) {
        this.First = first;
        this.Last = last;
        this.Success = first !== null;
    }

    Success: boolean;
    First: number;
    Last: number;
}

interface IParser {
    Parse(pub: IPublication): IParseResult
}

class RangeParser implements IParser {
    Parse(pub: IPublication): IParseResult {
        let regex = () => new RegExp('#[0-9]+\-[0-9]+', 'g');
        if(!regex().test(pub.Issues)){
            return new ParseResult();
        }

        let r = regex().exec(pub.Issues);
        let str = r[0].replace(/#/g, '');
        var parts = str.split('-');
        return new ParseResult(Number(parts[0]), Number(parts[1]));
    }
}

class SingleIssueParser implements IParser {
    Parse(pub: IPublication): IParseResult {
        let regex = () => new RegExp('#[0-9]+', 'g');
        if(!regex().test(pub.Issues)){
            return new ParseResult();
        }

        let r = regex().exec(pub.Issues);
        let str = r[0].replace(/#/g, '');
        return new ParseResult(1, 1);
    }
}

class SpecialCaseParser implements IParser {
    Parse(pub: IPublication): IParseResult {
        let gnReg = new RegExp('graphic novel', 'i');
        if(gnReg.test(pub.Notes)){
            return new ParseResult(1, 1);
        }

        let osReg = new RegExp('one[-]?[\s]?shot', 'i');
        if(osReg.test(pub.Notes)){
            return new ParseResult(1, 1);
        }

        return new ParseResult();
    }
}