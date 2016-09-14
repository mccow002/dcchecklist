import * as q from 'q';
import * as path from 'path';
import * as fs from 'fs'; 
import * as xpath from 'xpath';
import * as colors from 'colors';
import * as _ from 'lodash';
import { DOMParser } from 'xmldom';
import { IIssue } from './models/issue'
var Unrar = require('unrar');
var streamTo = require('stream-to-array');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');


export class ComicReader {

    constructor(private path:String) {}

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

    public GetMetadataFromComicRack(issue: IIssue): IIssue {
        var comicDb = path.join(process.env.APPDATA, 'cYo/ComicRack/ComicDb.xml');
        var dbXml = fs.readFileSync(comicDb, { encoding: 'UTF-8' });
        var doc = new DOMParser().parseFromString(dbXml);

        console.log(xpath.select('/ComicDatabase/Books/Book[@File="' + this.path + '"]', doc).toString());
        var book = (field: string) => xpath.select('string(/ComicDatabase/Books/Book[@File="' + this.path + '"]/' + field + ')', doc);
                
        issue.Title = book('Title');
        issue.Summary = book('Summary');
        issue.Writer = book('Writer');
        issue.Colorist = book('Colorist');
        issue.Letterer = book('Letterer');
        issue.CoverArtist = book('CoverArtist');
        issue.Editor = book('Editor');
        issue.Characters = book('Characters');
        issue.Teams = book('Teams');
        issue.Locations = book('Locations');
        issue.Month = book('Month');
        issue.Year = book('Year');

        return issue;
    }

}

export class PageData {
    Page: string;
    ImageBuffer: Buffer;

    constructor(page: string, imageStr: Buffer) {
        this.Page = page;
        this.ImageBuffer = imageStr;
    }
}