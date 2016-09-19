import { IIssue } from '../issues/issue-model';

export interface ITreeNode {
    Name: string,
    NodeType: string,
    Children: Array<ITreeNode>,
    Issues: Array<IIssue>
}

export class TreeFolder implements ITreeNode {
    Name: string;
    NodeType: string = 'Folder';
    Children: Array<ITreeNode> = new Array<ITreeNode>();
    Issues: Array<IIssue>;

    constructor(name: string) {
        this.Name = name;
    }
}

export class TreeList implements ITreeNode {
    Name: string;
    NodeType: string = 'List';
    Children: Array<ITreeNode>;
    Issues: Array<IIssue> = new Array<IIssue>();

    constructor(name: string) {
        this.Name = name;
    }
}