import { ITreeNode } from './tree-models';

export class CollectionService {

    static $inject = ['$q', '$http'];

    constructor(
        private $q: ng.IQService,
        private $http: ng.IHttpService) { }

    public SaveNode(parentNodeId: string, node: ITreeNode) {
        let q = this.$q.defer();
        let req = this.$http.post('/collectionapi/', {
            parentNodeId: parentNodeId,
            node: node    
        });

        req.success((issue: ng.IHttpPromiseCallback<ITreeNode>) => {
            q.resolve(issue);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public GetCollectionTree(){
        let q = this.$q.defer();
        let req = this.$http.get('/collectionapi/');

        req.success((issue: ng.IHttpPromiseCallback<ITreeNode>) => {
            q.resolve(issue);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public SaveState(expandedNodes: any) {
        let q = this.$q.defer();
        let req = this.$http.put('/collectionapi/savestate', expandedNodes);

        req.success(() => {
            q.resolve();
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }
}

export interface IGetTreeResponse {
    tree: any,
    expanded: any
}