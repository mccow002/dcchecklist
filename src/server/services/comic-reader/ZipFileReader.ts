import * as q from 'q';
import * as _ from 'lodash';
import * as path from 'path';
import { IComicFileReader } from './IComicFileReader';
import { PageData } from './PageData';
var admzip = require('adm-zip');

export class ZipFileReader implements IComicFileReader {

    constructor(private filepath: string) { }

    public GetFiles(): q.IPromise<string[]> {
        var d = q.defer();

        try {
            console.log(this.filepath);
            let zip = new admzip(this.filepath);
            var entries = _.map(zip.getEntries(), 'entryName');
            
            var regex = () => /[0-9]{2}/g;
            var pages = new Array<string>();        
            var exts = ['.jpg', '.jpeg', '.png', '.gif'];

            let filteredPages = _.filter(entries, (e: string) => {
                return regex().test(e) && path.extname(e) && exts.indexOf(path.extname(e).toLowerCase()) > -1
            });
            filteredPages = _.sortBy(filteredPages)

            d.resolve(filteredPages);
        }
        catch(ex) {
            console.log(ex);
            d.reject(ex);
        }

        return d.promise;
    }

    public GetImageBuffer(name: string): q.IPromise<PageData> {
        var d = q.defer();

        let zip = new admzip(this.filepath);
        var entry = (<any>_.chain(zip.getEntries()).filter((e: any) => e.entryName === name).first()).value();
        var buff = entry.getData();
        d.resolve(new PageData(name, buff));
                
        return d.promise;
    }
}