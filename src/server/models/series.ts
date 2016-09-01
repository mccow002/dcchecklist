import * as mongoose from 'mongoose';

export interface ISeries extends mongoose.Document {
    _type: String,
    Name: String,
    Volume: Number,
    NumberOfIssues: Number
}

export const SeriesSchema = new mongoose.Schema({
    _type: String,
    Name: String,
    Volume: Number,
    NumberOfIssues: Number
});
SeriesSchema.index({'$**': 'text'});

export const Series = mongoose.model<ISeries>('series', SeriesSchema, 'dccollection');