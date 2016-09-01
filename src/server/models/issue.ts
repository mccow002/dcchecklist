import * as mongoose from 'mongoose';

export interface IIssue extends mongoose.Document {
    _type: String,
    Number: Number,
    Title: String
}

export const IssueSchema = new mongoose.Schema({
    _type: String,
    Number: Number,
    Title: String
});
IssueSchema.index({'$**': 'text'});

export const Issue = mongoose.model<IIssue>('issue', IssueSchema, 'dccollection');