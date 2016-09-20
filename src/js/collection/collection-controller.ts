import { ITreeNode, TreeFolder, TreeList } from './tree-models';
import { CollectionService } from './collection-service';

export class CollectionController {

    static $inject = ['$mdDialog', 'collectionService'];

    TreeModel: Array<ITreeNode> = new Array<ITreeNode>();
    TreeOptions: any;
    SelectedFolder: ITreeNode;
    ExpandedNodes: Array<ITreeNode>;

    constructor(private $mdDialog: ng.material.IDialogService,
        private collectionService: CollectionService) {
        this.ExpandedNodes = new Array<any>();

        this.TreeOptions = {
            nodeChildren: "Children",
            dirSelectable: true,
            injectClasses: {
                iCollapsed: 'fa fa-folder tree-node-override',
                iExpanded: 'fa fa-folder-open tree-node-override',
                iLeaf: 'fa fa-book tree-node-override'
            },
            isLeaf: (node: any) => {
                return node.NodeType === 'List';
            }
        };

        collectionService.GetCollectionTree()
            .then((result: ITreeNode) => this.TreeModel.push(result));

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

    selectFolder(node: any) {
        this.SelectedFolder = node;
    }

    addFolder(ev: any) {
        var linkPrompt = this.$mdDialog.prompt()
            .title('Add Folder')
            .placeholder('Folder Name')
            .ariaLabel('FolderName')
            .targetEvent(ev)
            .ok('Add')
            .cancel('Cancel')
            .parent(angular.element(document.body));

        this.$mdDialog.show(linkPrompt)
            .then((result) => {
                let newNode = new TreeFolder(result);
                this.collectionService.SaveNode(this.SelectedFolder.path, newNode);
                // this.SelectedFolder.Children.push(newNode);
                // this.ExpandedNodes.push(this.SelectedFolder);
            });
    }

    addList() {
        // let mi = this.$mdDialog.open({
        //     controller: 'newFolderCtrl as nf',
        //     templateUrl: '/dist/views/new-folder.html',
        //     resolve: {
        //         Type: () => 'List'
        //     }
        // });

        // mi.result.then((listName: string) => {
        //     let newNode = new TreeList(listName)
        //     this.SelectedFolder.Children.push(newNode);
        //     this.ExpandedNodes.push(this.SelectedFolder);
        //     console.log(newNode);
        // });
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