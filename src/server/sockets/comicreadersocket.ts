import { ComicReader } from '../services/comic-reader/ComicReader';
import { PageData } from '../services/comic-reader/PageData';
import * as q from 'q';
import * as path from 'path';
var streamTo = require('stream-to-array');

class ComicReaderSockets {

    GetPage(data: any, socket: SocketIO.Server) {
        console.log('Getting Page - ' + JSON.stringify(data));

        var reader = new ComicReader(data.filePath);
        reader.GetImageBuffer(data.page)
            .then((pageData: PageData) => {
                socket.emit('pageLoaded', {
                    page: pageData.Page,
                    imageStr: pageData.ImageBuffer.toString('base64')
                });  
            });
    }

}

module.exports = ComicReaderSockets;