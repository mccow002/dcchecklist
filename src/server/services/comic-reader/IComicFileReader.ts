import * as q from 'q';
import { PageData } from './PageData';

export interface IComicFileReader {
    GetFiles: () => q.IPromise<string[]>,
    GetImageBuffer: (name: string) => q.IPromise<PageData>
}