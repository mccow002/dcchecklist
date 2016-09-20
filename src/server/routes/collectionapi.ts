import * as express from 'express';
import * as mongoose from 'mongoose';
import { ICollectionNode, CollectionNode } from '../models/collection-node';

export class CollectionApi {

    public CreateNode(req: express.Request, res: express.Response) {
        var request = <ICreateNodeRequest> req.body;
        console.log(request);
        CollectionNode.findById(request.parentNodeId, (err: mongoose.Error, result: ICollectionNode) => {
            console.log(result);
            let newNode = new CollectionNode();
            newNode.parent = result;
            newNode.Name = request.node.Name;
            newNode.NodeType = request.node.NodeType;
            console.log(newNode);

            newNode.save((err: mongoose.Error, savedNode: ICollectionNode) => {
                if(err) throw err;
                console.log(savedNode);
                res.json(savedNode);
            });
        })
    }

    public GetCollectionTree(req: express.Request, res: express.Response) {
        CollectionNode.findOne({
            _type: 'collectionnode',
            Name: 'Library'
        })
        .then((root: ICollectionNode) => {
            
            if(!root){
                var newRoot = new CollectionNode();
                newRoot._type = 'collectionnode';
                newRoot.Name = 'Library';
                newRoot.NodeType = 'Folder';
                CollectionNode.create(newRoot).then((savedRoot: ICollectionNode) => {
                    console.log(savedRoot)
                    res.json([savedRoot]);
                });
                return;
            }
            
            root.getChildren(true, (err: any, nodes: any) => {
                console.log(nodes);
                res.json(nodes.length === 0 ? root : nodes);
            });
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