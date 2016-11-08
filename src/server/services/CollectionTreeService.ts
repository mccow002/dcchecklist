import { ICollectionNode, CollectionNode } from '../models/collection-node';
import { ICollectionState, CollectionState } from '../models/collection-state';

export class CollectionTreeService {

    public CreateNode(parentNodeId: string, node: ICollectionNode): Promise<ICollectionNode> {
        return CollectionNode.findById(parentNodeId)
            .then((result: ICollectionNode) => {
                let newNode = new CollectionNode();
                console.log(newNode);
                (<any>newNode).parent = result;
                newNode.Name = node.Name;
                newNode.NodeType = node.NodeType;
                newNode._type = 'collectionnode';
                console.log(newNode);

                return newNode.save();
            });
    }

}