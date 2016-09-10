import * as express from 'express';
import * as mongoose from 'mongoose';
import * as q from 'q';
import * as fs from 'fs';
import { Issue, IIssue } from '../models/issue';
import { ComicReader } from '../ComicReader';
var app = require('../../../app');
var Unrar = require('unrar');
var streamTo = require('stream-to-array');

class ReaderApi {

    open(req: express.Request, res: express.Response, io: SocketIO.Server) {
        var id = req.params.id;
        console.log('Opening ' + id);
        Issue.findById(id, (err: mongoose.Error, result: IIssue) => {
            var reader = new ComicReader(result.FilePath);
            
            reader.GetFiles()
                .then((entries: any) => {
                    io.emit('pagesLoaded', entries);
                });

            res.json(200);
        });
    }

    getCover(req: express.Request, res: express.Response) {
        var id = req.params.id;
        Issue.findById(id, (err: mongoose.Error, result: IIssue) => {
            var reader = new ComicReader(result.FilePath);
            console.log(result);
            reader.GetFiles()
                .then((entries: any) => {
                    var rf = new Unrar(result.FilePath);
                    let stream = rf.stream(entries[0]);
                    stream.on('error', console.log);

                    streamTo(stream, (err: any, parts: any) => {
                        let buffers = new Array<any>();
                        for (let i = 0, l = parts.length; i < l ; ++i) {
                            var part = parts[i]
                            buffers.push((part instanceof Buffer) ? part : new Buffer(part))
                        }
                        
                        let buf = Buffer.concat(buffers)
                        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                        res.end(buf, 'binary');
                    });
                });
        });
    }

}

module.exports = (io: SocketIO.Server) => {
    let readerApi = new ReaderApi();
    let router = express.Router();
    router.get('/:id', (req: express.Request, res: express.Response) => {
        readerApi.open(req, res, io);
    });

    router.get('/cover/:id', readerApi.getCover);

    return router;
};