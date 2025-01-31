import { app } from '../checklist-app';
import { PubService, IPubResult } from './publications-service';
import { IPublication } from './publication-model';
import { ISeries } from '../series/series-model';
import { ParseSeriesPresenter } from '../series/parse-series-controller';

class Search {
    SearchText: string
}

interface IPublisherParams extends ng.ui.IStateParamsService {
    sort: string,
    searchTerm: string
}

interface ILocationCache {
    Type: string,
    Value: string
}

export class PublicationsController {

    static $inject = ['$rootScope', 'pubService', '$stateParams', '$state', 'toastr', '$mdDialog', 'localStorageService', 'parseSeriesPresenter'];

    LocationKey: string = 'lastPubUrl';

    Publications: Array<IPublication>;
    Indexes: Array<string>;
    Index: number;
    SearchParams: Search;
    Loading: boolean;
    Owned: number;

    constructor(
        private $rootScope: ng.IRootScopeService,
        private pubService: PubService,
        private $stateParams: IPublisherParams,
        private $state: ng.ui.IStateService,
        private toastr: ng.toastr.IToastrService,
        private $mdDialog: ng.material.IDialogService,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private parseSeriesPresenter: ParseSeriesPresenter) {
        
        this.Indexes = new Array<string>();
        this.Index = 0;
        this.SearchParams = new Search();

        this.Indexes.push("0-9");
        for(let i = 65;i<91;++i) {
            this.Indexes.push(String.fromCharCode(i));
        }

        var locCache = <ILocationCache>localStorageService.get(this.LocationKey);
        if(locCache){
            if(locCache.Type === 'sort') {
                this.Index = this.Indexes.indexOf(locCache.Value);
                this.load();
            } else if(locCache.Type === 'search') {
                this.SearchParams.SearchText = locCache.Value;
                this.search();
            }

            return;
        }

        if($stateParams.searchTerm){
            this.setLocationCache('search', $stateParams.searchTerm);
            this.SearchParams.SearchText = $stateParams.searchTerm;
            this.search();
            return;
        }

        if($stateParams.sort){
            this.setLocationCache('sort', this.$stateParams.sort);
            this.Index = this.Indexes.indexOf($stateParams.sort);
        }

        this.load();
    }

    private setLocationCache(type: string, value: string) {
        this.localStorageService.set(this.LocationKey, {
                Type: type,
                Value: value
            });
    }

    load() {
        this.Publications = [];
        this.pubService.load(this.Indexes[this.Index])
            .then((data: IPubResult) => {
                this.Publications = data.publications;
                this.Owned = data.owned;
            });
    }

    goToSlice(sort: string) {
        this.localStorageService.remove(this.LocationKey);
        this.$state.go('publications', {sort: sort});
    }

    goToSearch() {
        this.localStorageService.remove(this.LocationKey);
        this.$state.go('publicationsSearch', { searchTerm: this.SearchParams.SearchText }, {location: 'replace'});
    }

    search() {

        this.Publications = new Array<IPublication>();

        if(this.SearchParams.SearchText === ''){
            this.load();
            return;
        }

        this.pubService.Search(this.SearchParams.SearchText)
            .then((data: IPubResult) => {
                this.Publications = data.publications;
                this.Owned = data.owned;
            });
    }

    clearSearch() {
        this.SearchParams.SearchText = '';
        this.load();
    }

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
        this.pubService.Put(pub)
            .then((owned: number) => this.Owned = owned);
    }
    
    Remove(pub: IPublication, ev: any) {
        var confirm = this.$mdDialog.confirm()
          .title('Delete Publication')
          .textContent('Are you sure you wish to delete this publication? This cannot be undone.')
          .targetEvent(ev)
          .ok('Delete!')
          .cancel('Cancel');

        var self = this;
        this.$mdDialog.show(confirm).then(() => {
            self.pubService.Delete(pub)
                .then((owned: number) => self.Owned = owned);

            var index = self.Publications.indexOf(pub);
            self.Publications.splice(index, 1);
        });
    }

    ParseSeries(pub: IPublication, ev: any) {
        this.parseSeriesPresenter.Open(pub, ev)
            .then((series: ISeries) => {
                this.toastr.success('Series parsed!');
                this.$state.go('seriesDetails', {seriesId: series._id});
            });
    }
}