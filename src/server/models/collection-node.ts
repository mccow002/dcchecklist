import * as mongoose from 'mongoose';
import { IIssue } from './issue';
var tree = require('mongoose-tree2');

export interface ICollectionNode extends mongoose.Document {
    _type: String,
    NodeType: String,
    Name: String,
    parent: ICollectionNode,
    Children: Array<ICollectionNode>,
    Issues: Array<IIssue>,
    getChildren: Function
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
CollectionNodeSchema.plugin(tree);

export const CollectionNode = mongoose.model<ICollectionNode>('collectionnode', CollectionNodeSchema, 'dccollection');