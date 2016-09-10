import { ComicReader, PageData } from '../ComicReader';
import * as q from 'q';
import * as path from 'path';
var streamTo = require('stream-to-array');

class ComicReaderSockets {

    GetPage(data: any, socket: SocketIO.Server) {
        console.log('Getting Page - ' + JSON.stringify(data));

        var reader = new ComicReader(data.filePath);
        reader.GetImageAsBase64(data.page)
            .then((pageData: PageData) => {
                socket.emit('pageLoaded', {
                    page: pageData.Page,
                    imageStr: pageData.ImageStr
                });  
            });
    }

}

module.exports = ComicReaderSockets;