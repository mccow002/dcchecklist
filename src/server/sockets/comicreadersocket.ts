import { ComicReader } from '../services/comic-reader/ComicReader';
import { PageData } from '../services/comic-reader/PageData';
import { Issue, IIssue } from '../models/issue';
import * as q from 'q';
import * as path from 'path';
import * as mongoose from 'mongoose';
var streamTo = require('stream-to-array');

class ComicReaderSockets {

    GetPage(data: IPageRequest, socket: SocketIO.Server) {
        console.log('Getting Page - ' + JSON.stringify(data));

        var reader = new ComicReader(data.filePath);
        reader.GetImageBuffer(data.page)
            .then((pageData: PageData) => {
                Issue.findById(data.issueId, (err: mongoose.Error, result: IIssue) => {
                    if(err) throw err;

                    result.CurrentPage = data.currentPage;
                    console.log(result);
                    Issue.findByIdAndUpdate(data.issueId, result, (err: mongoose.Error) => {
                        if(err) throw err;

                        socket.emit('pageLoaded', {
                            page: pageData.Page,
                            imageStr: pageData.ImageBuffer.toString('base64')
                        });  
                    })
                });
            });
    }

}

interface IPageRequest {
    filePath: string,
    page: string,
    issueId: string,
    currentPage: number
}

module.exports = ComicReaderSockets;