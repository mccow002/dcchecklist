import * as mongoose from 'mongoose';

export interface ICollectionState extends mongoose.Document {
    _type: String,
    State: Object
}

export const CollectionStateSchema = new mongoose.Schema({
    _type: String,
    State: Object
});

export const CollectionState = mongoose.model<ICollectionState>('collectionstate', CollectionStateSchema, 'dccollection');