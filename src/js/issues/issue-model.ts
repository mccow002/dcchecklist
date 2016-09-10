export interface IIssue {
    _id: string,
    _type: String,
    Number: Number,
    Title: String,
    FilePath: String,
    Month: String,
    Year: String,
    Summary: String,
    Writer: String,
    Colorist: String,
    Letterer: String, 
    CoverArtist: String,
    Editor: String,
    Characters: String, 
    Teams: String,
    Locations: String
}

export class Issue implements IIssue {
    _id: string;
    _type: String;
    Number: Number;
    Title: String;
    FilePath: String;
    Month: String;
    Year: String;
    Summary: String;
    Writer: String;
    Colorist: String;
    Letterer: String; 
    CoverArtist: String;
    Editor: String;
    Characters: String; 
    Teams: String;
    Locations: String;

    constructor(number: number) {
        this.Number = number;
    }
}