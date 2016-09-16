import * as q from 'q';
import * as _ from 'lodash';
import * as path from 'path';
import { IComicFileReader } from './IComicFileReader';
import { PageData } from './PageData';
var Unrar = require('../../../../unrar/unrar');
var streamTo = require('stream-to-array');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');

export class RarFileReader implements IComicFileReader {

    constructor(private filePath: string) { }

    public GetFiles(): q.IPromise<string[]> {
        var d = q.defer();
        
        var rf = new Unrar(this.filePath);
        rf.list((err: any, entries: any) => {
            if(err) throw err;

            var regex = () => /[0-9]{2}/g;
            var pages = _.map(entries, (e: any) => e.name);
            var exts = ['.jpg', '.jpeg', '.png', '.gif'];


            let filteredPages = _.filter(pages, (e: any) => {
                return regex().test(e) && path.extname(e) && exts.indexOf(path.extname(e).toLowerCase()) > -1;
            });
            filteredPages = _.sortBy(filteredPages)
            console.log(filteredPages[0]);

            d.resolve(filteredPages);
        });

        return d.promise;
    }

    public GetImageBuffer(name: string): q.IPromise<PageData> {
        let d = q.defer();

        var rf = new Unrar(this.filePath);
        let stream = rf.stream(name);
        stream.on('error', console.log);

        streamTo(stream, (err: any, parts: any) => {
            let buffers = new Array<any>();
            for (let i = 0, l = parts.length; i < l ; ++i) {
                var part = parts[i]
                buffers.push((part instanceof Buffer) ? part : new Buffer(part))
            }
            
            let buf = Buffer.concat(buffers)

            imagemin.buffer(buf, {
                plugins: [ imageminMozjpeg() ]
            }).then((compressedBuf: Buffer) => {
                d.resolve(new PageData(name, compressedBuf));
            });
        });

        return d.promise;
    }

}