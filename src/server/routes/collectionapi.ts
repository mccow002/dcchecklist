import * as express from 'express';
import * as mongoose from 'mongoose';
import { ICollectionNode, CollectionNode } from '../models/collection-node';

export class CollectionApi {

    public CreateNode(req: express.Request, res: express.Response) {
        var request = <ICreateNodeRequest> req.body;


    }

    public GetCollectionTree(req: express.Request, res: express.Response) {
        CollectionNode.find({
            _type: 'collectionnode',
            Name: 'Library'
        })
        .then((result: ICollectionNode[]) => {
            console.log(result);
            if(result.length === 0){
                var root = new CollectionNode();
                root._type = 'collectionnode';
                root.Name = 'Library';
                root.NodeType = 'Folder';
                CollectionNode.create(root).then((newRoot: ICollectionNode) => {
                    console.log(newRoot)
                    res.json(newRoot);
                });
                return;
            }

            res.json(result);
        })
    }

}

interface ICreateNodeRequest {
    parentNodeId: string,
    node: ICollectionNode
}

let collectionApi = new CollectionApi();
let router = express.Router();
router.get('/', collectionApi.GetCollectionTree);
router.post('/', collectionApi.CreateNode);

module.exports = router;