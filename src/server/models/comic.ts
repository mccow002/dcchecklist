import * as mongoose from 'mongoose';

export interface IPublication extends mongoose.Document {
    FirstChar: String,
    Title: String,
    Series: String,
    Issues: String,
    Dates: String,
    Notes: String,
    Owned: Boolean
}

export const PublicationSchema = new mongoose.Schema({
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