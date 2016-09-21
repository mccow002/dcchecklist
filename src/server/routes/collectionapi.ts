import * as express from 'express';
import * as mongoose from 'mongoose';
import { ICollectionNode, CollectionNode } from '../models/collection-node';
import { ICollectionState, CollectionState } from '../models/collection-state';

export class CollectionApi {

    public CreateNode(req: express.Request, res: express.Response) {
        var request = <ICreateNodeRequest> req.body;
        console.log(request);
        CollectionNode.findById(request.parentNodeId, (err: mongoose.Error, result: ICollectionNode) => {
            console.log(result);
            let newNode = new CollectionNode();
            console.log(newNode);
            (<any>newNode).parent = result;
            newNode.Name = request.node.Name;
            newNode.NodeType = request.node.NodeType;
            newNode._type = 'collectionnode';
            console.log(newNode);

            newNode.save().then((savedNode: ICollectionNode) => {
                if(err) throw err;
                console.log(savedNode);
                res.json(savedNode);
            });
        })
    }

    public GetCollectionTree(req: express.Request, res: express.Response) {
        (<any>CollectionNode).getChildrenTree((err: any, nodes: any) => {
            
            CollectionState.findOne({_type: 'collectionstate'}, (err: mongoose.Error, state: ICollectionState) => {
                res.json({
                    tree: nodes,
                    expanded: state.State   
                });
            })
        });
    }

    public SaveState(req: express.Request, res: express.Response) {
        CollectionState.findOne({_type: 'collectionstate'})
            .then((state: ICollectionState) => {
                if(!state){
                    state = new CollectionState();
                    state._type = 'collectionstate';
                    state.State = req.body;
                } else {
                    state.State = req.body;
                }

                state.save().then(() => res.json(200));
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
router.put('/savestate', collectionApi.SaveState);

module.exports = router;