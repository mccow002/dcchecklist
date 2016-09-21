import * as mongoose from 'mongoose';
import { IIssue } from './issue';
var tree = require('mongoose-path-tree');

export interface ICollectionNode extends mongoose.Document {
    _type: String,
    NodeType: String,
    Name: String,
    Children: Array<ICollectionNode>,
    Issues: Array<IIssue>
}

export const CollectionNodeSchema = new mongoose.Schema({
    _type: String,
    NodeType: String,
    Name: String,
    Issues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'issue'
    }]
});
CollectionNodeSchema.plugin(tree, {
    pathSeparator: '#',
    onDelete: 'REPARENT',
    idType: mongoose.Schema.Types.ObjectId
});

export const CollectionNode = mongoose.model<ICollectionNode>('collectionnode', CollectionNodeSchema, 'dccollection');