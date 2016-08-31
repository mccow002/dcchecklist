export interface IParseResult {
    Success: boolean,
    First: number,
    Last: number
}

export class ParseSeries {

}

class ParseResult implements IParseResult {
    Success: boolean;
    First: number;
    Last: number;
}

interface IParser {
    Parse(issues: string): IParseResult
}

class RangeParser implements IParser {
    Parse(issues: string): IParseResult {
        return null;
    }
}