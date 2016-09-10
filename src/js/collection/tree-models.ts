export interface ITreeNode {
    Name: string,
    _type: string,
    Children: Array<ITreeNode>
}

export class TreeFolder implements ITreeNode {
    Name: string;
    _type: string = 'Folder';
    Children: Array<ITreeNode> = new Array<ITreeNode>();

    constructor(name: string) {
        this.Name = name;
    }
}

export class TreeList implements ITreeNode {
    Name: string;
    _type: string = 'List';
    Children: Array<ITreeNode> = new Array<ITreeNode>();

    constructor(name: string) {
        this.Name = name;
    }
}