import * as mongoose from 'mongoose';

export interface IIssue extends mongoose.Document {
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
    Locations: String,
    CurrentPage: Number
}

export const IssueSchema = new mongoose.Schema({
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
    Locations: String,
    CurrentPage: Number
});
IssueSchema.index({'$**': 'text'});

export const Issue = mongoose.model<IIssue>('issue', IssueSchema, 'dccollection');