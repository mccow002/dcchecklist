import { IIssue } from '../issues/issue-model';

export interface ITreeNode {
    _id: string,
    Name: string,
    NodeType: string,
    children: Array<ITreeNode>,
    Issues: Array<IIssue>,
    parent: string
}

export class TreeFolder implements ITreeNode {
    _id: string;
    Name: string;
    NodeType: string = 'Folder';
    children: Array<ITreeNode> = new Array<ITreeNode>();
    Issues: Array<IIssue>;
    parent: string;

    constructor(name: string) {
        this.Name = name;
    }
}

export class TreeList implements ITreeNode {
    _id: string;
    Name: string;
    NodeType: string = 'List';
    children: Array<ITreeNode>;
    Issues: Array<IIssue> = new Array<IIssue>();
    parent: string;

    constructor(name: string) {
        this.Name = name;
    }
}