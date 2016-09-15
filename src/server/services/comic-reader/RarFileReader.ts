import * as q from 'q';
import * as _ from 'lodash';
import { IComicFileReader } from './IComicFileReader';
import { PageData } from './PageData';
var Unrar = require('unrar');
var streamTo = require('stream-to-array');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');

export class RarFileReader implements IComicFileReader {

    constructor(private path: string) { }

    public GetFiles(): q.IPromise<string[]> {
        var d = q.defer();
        
        var rf = new Unrar(this.path);
        rf.list((err: any, entries: any) => {
            var regex = () => /[0-9]{2}/g;
            var pages = new Array<string>();
            
            for(let i = 0; i < entries.length; i++) {
                if(!regex().test(entries[i].name))
                    continue;
                
                pages.push(entries[i].name);
            }
            
            d.resolve(_.sortBy(pages));
        });

        return d.promise;
    }

    public GetImageBuffer(name: string): q.IPromise<PageData> {
        let d = q.defer();

        var rf = new Unrar(this.path);
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