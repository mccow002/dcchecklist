import {app} from './checklist-app';
import {PubService} from './publications-service'

export class PublicationsController {

    static $inject = ['publisherService'];

    comics: any[];
    indexes: String[]
    index = 0;

    constructor(private pubService: PubService) {
        this.indexes.push("0-9");
        for(let i = 65;i<91;++i) {
            this.indexes.push(String.fromCharCode(i));
        }

        this.load();
    }

    load() {
        this.comics = [];
        this.pubService.load(this.indexes[this.index])
            .then((data: any) => {
                this.comics = data;
            });
    };
};