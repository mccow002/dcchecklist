import * as mongoose from 'mongoose';
import { IssueSchema, IIssue } from './issue';

export interface ISeries extends mongoose.Document {
    _type: String,
    Name: String,
    Volume: Number,
    SeriesType: String, //Annuals, one-shot, etc
    NumberOfIssues: Number,
    Issues: Array<IIssue>
}

export const SeriesSchema = new mongoose.Schema({
    _type: String,
    Name: String,
    Volume: Number,
    SeriesType: String,
    NumberOfIssues: Number,
    Issues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'issue'
    }]
});
SeriesSchema.index({'$**': 'text'});

export const Series = mongoose.model<ISeries>('series', SeriesSchema, 'dccollection');