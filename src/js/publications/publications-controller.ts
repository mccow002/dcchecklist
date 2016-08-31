import {app} from '../checklist-app';
import {PubService} from './publications-service';

export class PublicationsController {

    static $inject = ['pubService', '$uibModal'];

    Publications: Array<any>;
    Indexes: Array<string>;
    Index: number;

    constructor(private pubService: PubService, private modal: ng.ui.bootstrap.IModalService) {
        
        this.Indexes = new Array<string>();
        this.Index = 0;

        this.Indexes.push("0-9");
        for(let i = 65;i<91;++i) {
            this.Indexes.push(String.fromCharCode(i));
        }

        this.load();
    }

    load() {
        this.Publications = [];
        this.pubService.load(this.Indexes[this.Index])
            .then((data: any) => {
                this.Publications = data;
            });
    }

    loadSlice(index: number) {
        this.Index = index;
        this.load();
    }

    BuildCvSearchUrl(pub: any) {
        return "http://comicvine.gamespot.com/search/?q=" + pub.Title.replace(/ /g, '+');
    };

    BuildDcSearchUrl(pub: any) {
        return 'http://dc.wikia.com/wiki/Special:Search?fulltext=Search&search=' + pub.Title.replace(/ /g, '+');
    };

    FlagAsOwned(pub: any) {
        if(pub.Owned){
            return 'success';
        }
    }

    MarkAsOwned(pub: any) {
        pub.Owned = !pub.Owned;
        this.pubService.Put(pub);
    }
    
    Remove(pub: any) {
        this.pubService.Delete(pub);
        var index = this.Publications.indexOf(pub);
        this.Publications.splice(index, 1);
    }

    ParseSeries(pub: any) {
        let mi = this.modal.open({
            controller: 'parseSeriesCtrl as ps',
            templateUrl: '/templates/publications/parseSeries.html',
            resolve: {
                pub: () => pub
            }
        });
    };
};