import { app } from '../checklist-app';
import { PubService } from './publications-service';
import { IPublication } from './publication-model';
import { ISeries } from '../series/series-model';

class Search {
    SearchText: string
}

interface IPublisherParams extends ng.ui.IStateParamsService {
    sort: string
}

export class PublicationsController {

    static $inject = ['pubService', '$uibModal', '$stateParams', '$state', 'toastr'];

    Publications: Array<IPublication>;
    Indexes: Array<string>;
    Index: number;
    SearchParams: Search;
    Loading: boolean = true;

    constructor(
        private pubService: PubService, 
        private modal: ng.ui.bootstrap.IModalService,
        private $stateParams: IPublisherParams,
        private $state: ng.ui.IStateService,
        private toastr: ng.toastr.IToastrService) {
        
        this.Indexes = new Array<string>();
        this.Index = 0;
        this.SearchParams = new Search();

        this.Indexes.push("0-9");
        for(let i = 65;i<91;++i) {
            this.Indexes.push(String.fromCharCode(i));
        }

        if($stateParams.sort){
            this.Index = this.Indexes.indexOf($stateParams.sort);
        }

        this.load();
    }

    load() {
        this.Publications = [];
        this.pubService.load(this.Indexes[this.Index])
            .then((data: IPublication[]) => {
                this.Publications = data;
            });
    }

    loadSlice(index: number) {
        // this.Index = index;
        // this.load();
        return '#/publications/' + this.Indexes[index];
    }

    search() {
        this.Publications = new Array<IPublication>();

        if(this.SearchParams.SearchText === ''){
            this.load();
            return;
        }

        this.pubService.Search(this.SearchParams.SearchText)
            .then((data: IPublication[]) => {
                this.Publications = data;
            });
    };

    BuildCvSearchUrl(pub: IPublication) {
        return "http://comicvine.gamespot.com/search/?q=" + pub.Title.replace(/ /g, '+');
    };

    BuildDcSearchUrl(pub: IPublication) {
        return 'http://dc.wikia.com/wiki/Special:Search?fulltext=Search&search=' + pub.Title.replace(/ /g, '+');
    };

    FlagAsOwned(pub: IPublication) {
        if(pub.Owned){
            return 'success';
        }
    }

    MarkAsOwned(pub: IPublication) {
        pub.Owned = !pub.Owned;
        this.pubService.Put(pub);
    }
    
    Remove(pub: IPublication) {
        this.pubService.Delete(pub);
        var index = this.Publications.indexOf(pub);
        this.Publications.splice(index, 1);
    }

    ParseSeries(pub: IPublication) {
        let mi = this.modal.open({
            controller: 'parseSeriesCtrl as ps',
            templateUrl: '/dist/views/parseSeries.html',
            resolve: {
                pub: () => pub
            }
        });

        mi.result.then((series: ISeries) => {
            this.toastr.success('Series parsed!');
            this.$state.go('series');
        });
    }
}