
export interface IPublicationsScope extends ng.IScope {
    Publications: Array<any>,
    Indexes: Array<string>,
    Index: number,
    LoadSlice: Function
}