import * as mongoose from 'mongoose';
import { IssueSchema, IIssue, Issue } from './issue';

export interface ISeries extends mongoose.Document {
    _type: String,
    Name: String,
    Volume: Number,
    SeriesType: String, //Annuals, one-shot, etc
    NumberOfIssues: Number,
    StartDate: Date,
    EndDate: Date,
    Issues: Array<IIssue>
}

export const SeriesSchema = new mongoose.Schema({
    _type: String,
    Name: String,
    Volume: Number,
    SeriesType: String,
    NumberOfIssues: Number,
    StartDate: Date,
    EndDate: Date,
    Issues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'issue'
    }]
});
SeriesSchema.index({'$**': 'text'});

SeriesSchema.pre('remove', (next) => {
    console.log(this);
    Issue.remove({_id: this._id}, next);
})

export const Series = mongoose.model<ISeries>('series', SeriesSchema, 'dccollection');