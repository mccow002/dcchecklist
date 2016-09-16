import * as q from 'q';
import * as path from 'path';
import * as fs from 'fs'; 
import * as xpath from 'xpath';
import * as colors from 'colors';
import * as _ from 'lodash';
import { DOMParser } from 'xmldom';
import { IIssue } from '../../models/issue';
import { IComicFileReader } from './IComicFileReader';
import { ZipFileReader } from './ZipFileReader';
import { RarFileReader } from './RarFileReader';
import { PageData } from './PageData';
var rarfile = require('rarfile');


export class ComicReader {

    reader: IComicFileReader;

    constructor(private filepath: string) {
        if(rarfile.isRarFile(filepath)) {
            this.reader = new RarFileReader(filepath);
        } else {
            this.reader = new ZipFileReader(filepath);
        }
    }

    public GetFiles(): q.IPromise<string[]> {
        return this.reader.GetFiles();
    }

    public GetImageBuffer(name: string): q.IPromise<PageData> {
        return this.reader.GetImageBuffer(name);
    }

    public GetMetadataFromComicRack(issue: IIssue): IIssue {
        var comicDb = path.join(process.env.APPDATA, 'cYo/ComicRack/ComicDb.xml');
        var dbXml = fs.readFileSync(comicDb, { encoding: 'UTF-8' });
        var doc = new DOMParser().parseFromString(dbXml);

        if(!xpath.select('/ComicDatabase/Books/Book[@File="' + this.filepath + '"]', doc).toString()) {
            throw 'File not in ComicRack!';
        }

        var book = (field: string) => xpath.select('string(/ComicDatabase/Books/Book[@File="' + this.filepath + '"]/' + field + ')', doc);
                
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