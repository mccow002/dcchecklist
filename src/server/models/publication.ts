import * as mongoose from 'mongoose';

export interface IPublication extends mongoose.Document {
    _type: String,
    FirstChar: String,
    Title: String,
    Series: String,
    Issues: String,
    Dates: String,
    Notes: String,
    Owned: Boolean
}

export const PublicationSchema = new mongoose.Schema({
    _type: String,
    FirstChar: String,
    Title: String,
    Series: String,
    Issues: String,
    Dates: String,
    Notes: String,
    Owned: Boolean
});
PublicationSchema.index({'$**': 'text'});

export const Publication = mongoose.model<IPublication>('publications', PublicationSchema);