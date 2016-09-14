export interface IIssue {
    _id: string,
    _type: string,
    Number: Number,
    Title: string,
    FilePath: string,
    Month: string,
    Year: string,
    Summary: string,
    Writer: string,
    Colorist: string,
    Letterer: string, 
    CoverArtist: string,
    Editor: string,
    Characters: string, 
    Teams: string,
    Locations: string
}

export class Issue implements IIssue {
    _id: string;
    _type: string;
    Number: Number;
    Title: string;
    FilePath: string;
    Month: string;
    Year: string;
    Summary: string;
    Writer: string;
    Colorist: string;
    Letterer: string; 
    CoverArtist: string;
    Editor: string;
    Characters: string; 
    Teams: string;
    Locations: string;

    constructor(number: number) {
        this.Number = number;
    }
}