import { ITreeNode, TreeFolder, TreeList } from './tree-models';
import { CollectionService, IGetTreeResponse } from './collection-service';

export class CollectionController {

    static $inject = ['$mdDialog', '$state', 'collectionService'];

    TreeModel: ITreeNode;
    TreeOptions: any;
    SelectedFolder: ITreeNode;
    ExpandedNodes: Array<ITreeNode>;

    constructor(private $mdDialog: ng.material.IDialogService,
        private $state: ng.ui.IStateService,
        private collectionService: CollectionService) {
        this.ExpandedNodes = new Array<any>();

        this.TreeOptions = {
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                iCollapsed: 'fa fa-folder tree-node-override',
                iExpanded: 'fa fa-folder-open tree-node-override',
                iLeaf: 'fa fa-book tree-node-override',
                li: 'tree-node',
                label: 'tree-node-selected'
            },
            isLeaf: (node: any) => {
                return node.NodeType === 'List';
            }
        };

        collectionService.GetCollectionTree()
            .then((result: IGetTreeResponse) => {
                this.TreeModel = result.tree;
                this.ExpandedNodes = result.expanded;
            });

        // this.TreeModel = [
        //     {Name: "DC", _type: 'Folder', Children: [
        //         {Name: 'Pre Crisis', _type: 'Folder', Children: [
        //             {Name: 'Teen Titans', _type: 'Folder', Children: []}
        //         ]},
        //         {Name: 'Crisis on Infinite Earths', _type: 'List', Children: []},
        //         {Name: 'Post Crisis', _type: 'Folder', Children: [

        //         ]},
        //         {Name: 'Zero Hour - Identity Crisis', _type: 'Folder', Children: [

        //         ]}
        //     ]}
        // ];

        // this.ExpandedNodes = [
        //     this.TreeModel[0]
        // ]
    }

    showTreeMenu() {
        console.log(this.SelectedFolder);
        return this.SelectedFolder === undefined ||
            (this.SelectedFolder !== undefined && this.SelectedFolder.NodeType !== "List")
    }

    selectFolder(node: any) {
        this.SelectedFolder = node;
    }

    toggleNode() {
        this.collectionService.SaveState(this.ExpandedNodes);
    }

    deleteNode(ev: any) {
        var confirm = this.$mdDialog.confirm()
          .title('Delete ' + this.SelectedFolder.NodeType)
          .textContent('Are you sure you wish to delete this ' + this.SelectedFolder.NodeType + '? This cannot be undone.')
          .targetEvent(ev)
          .ok('Delete!')
          .cancel('Cancel');

        var self = this;
        this.$mdDialog.show(confirm).then(function() {
            console.log('DELETING!');
            self.collectionService.DeleteNode(self.SelectedFolder._id)
                .then(() => self.$state.reload());
        });

        this.collectionService.DeleteNode(this.SelectedFolder._id)
            .then(() => this.$state.reload());
    }

    addFolder(ev: any) {
        this.addNode('Folder', ev)
            .then((result) => {
                let newNode = new TreeFolder(result);
                this.collectionService.SaveNode(this.SelectedFolder._id, newNode);
                this.SelectedFolder.children.push(newNode);
                this.ExpandedNodes.push(this.SelectedFolder);
            });
    }

    addList(ev: any) {
        this.addNode('List', ev)
            .then((result) => {
                let newNode = new TreeList(result);
                this.collectionService.SaveNode(this.SelectedFolder._id, newNode);
                this.SelectedFolder.children.push(newNode);
                this.ExpandedNodes.push(this.SelectedFolder);
            })
    }

    addNode(type: string, ev: any) {
        var prompt = this.$mdDialog.prompt()
            .title('Add ' + type)
            .placeholder(type + ' Name')
            .ariaLabel(type + ' Name')
            .targetEvent(ev)
            .ok('Add')
            .cancel('Cancel')
            .parent(angular.element(document.body));

        return this.$mdDialog.show(prompt);
    }

    nodeToggle(node: any, expanded: boolean) {
        //this.ExpandedNodes.push(node);
    }

}

export class NewFolderController {
    
    static $inject = ['$uibModalInstance', 'Type'];

    FolderName: string;
    Title: string;
    Label: string;

    constructor(
        private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
        private Type: string) {
            this.Title = 'New ' + Type;
            this.Label = Type + ' Name: '
         }

    cancel() {
        this.$uibModalInstance.dismiss('cancel');
    }

    add() {
        this.$uibModalInstance.close(this.FolderName);
    }
}