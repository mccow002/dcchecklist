import * as _ from 'lodash';
import { SeriesService } from './series-service';
import { ISeries } from './series-model';

interface ISeriesDetailsRouteParams extends ng.ui.IStateParamsService {
    seriesId: string
}

export class SeriesDetailsController {

    static $inject = ['$stateParams', '$state', '$uibModal', '$mdDialog', '$mdSidenav', '$window', 'toastr', 'seriesService'];

    Series: ISeries;
    route: string;
    LoadingSeries: boolean = true;

    constructor(
        private $stateParams: ISeriesDetailsRouteParams,
        private $state: ng.ui.IStateService,
        private $uibModal: ng.ui.bootstrap.IModalService,
        private $mdDialog: ng.material.IDialogService,
        private $mdSidenav: ng.material.ISidenavService,
        private $window: ng.IWindowService,
        private toastr: ng.toastr.IToastrService,
        private seriesService: SeriesService) {
        seriesService.GetOne($stateParams.seriesId)
            .then((series: ISeries) => {
                this.Series = series;
                this.LoadingSeries = false;
                if($state.current.name !== 'seriesDetails.Issue') {
                    this.$state.go('seriesDetails.Issue', {
                        seriesId: $stateParams.seriesId,
                        issueId: series.Issues[0]._id
                    });
                }
            });

        this.route = JSON.stringify($window.location.hash);
    }

    goToIssue(issueId: string) {
        this.$state.go('seriesDetails.Issue', {issueId: issueId})
            .then(() => {
                let sideNav = this.$mdSidenav('left');
                if(sideNav.isOpen() && !sideNav.isLockedOpen()) {
                    sideNav.close();
                }
            })
    }

    getActive(issueId: string) {
        let issueUrl = '/series/' + this.Series._id + '/' + issueId;
        let url = this.$window.location.hash.substring(1, this.$window.location.hash.length);

        if(issueUrl === url) {
            return 'nav-active';
        }

        return '';
    }

    linkSeries(ev: any) {
        this.$mdDialog.show({
            controller: LinkSeriesController,
            controllerAs: 'ls',
            templateUrl: '/dist/views/link-series.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                series: this.Series
            }
        })
        .then((result: ISeries) => {
            this.toastr.success('Series Linked!');
            this.$state.reload();
        });
    }

    deleteSeries(ev: any){
        var confirm = this.$mdDialog.confirm()
          .title('Delete Series')
          .textContent('Are you sure you wish to delete this series? This cannot be undone.')
          .targetEvent(ev)
          .ok('Delete!')
          .cancel('Cancel');

        var self = this;
        this.$mdDialog.show(confirm).then(function() {
            console.log('DELETING!');
            self.seriesService.DeleteSeries(self.Series._id)
                .then(() => self.$state.go('series'));
        });
    }

    toggleIssues() {
        this.$mdSidenav('left')
            .toggle();
    }

    previousSeries(ev: any) {
        if(this.Series.PreviousSeries){
            this.$state.go('seriesDetails', { seriesId: this.Series.PreviousSeries });
            return;
        }

        this.selectSeries(ev)
            .then((result: ISeries) => {
                this.seriesService.LinkPrevious(this.Series._id, result._id)
                    .then(() => this.$state.go('seriesDetails', { seriesId: result._id }));
            });
    }

    nextSeries(ev: any) {
        if(this.Series.NextSeries){
            this.$state.go('seriesDetails', { seriesId: this.Series.NextSeries });
            return;
        }

        this.selectSeries(ev)
            .then((result: ISeries) => {
                this.seriesService.LinkNext(this.Series._id, result._id)
                    .then(() => this.$state.go('seriesDetails', { seriesId: result._id }));
            });
    }

    selectSeries(ev: any) {
        return this.$mdDialog.show({
            controller: PickSeriesController,
            controllerAs: 'ps',
            templateUrl: '/dist/views/pick-series.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                series: this.Series
            }
        });
    }

    mergeSeries(ev: any) {
        this.selectSeries(ev)
            .then((result: ISeries) => {
                console.log(result);
                return this.seriesService.MergeSeries(result._id, this.Series._id);
            })
            .then((result: ISeries) => this.$state.go('seriesDetails', { seriesId: result._id }));
    }
}

class LinkSeriesController {
    
    static $inject = ['$mdDialog', 'seriesService', 'toastr', 'series'];

    Series: ISeries;
    FilePath: string;
    Files: Array<string>;
    SelectedFile: string;

    constructor(
        private $mdDialog: ng.material.IDialogService,
        private seriesService: SeriesService,
        private toastr: ng.toastr.IToastrService,
        private series: ISeries) {
            this.Series = series;
            this.FilePath = '';
            this.SelectedFile = '';
            this.Files = new Array<string>();
        }

    cancel() {
        this.$mdDialog.cancel();
    }

    scanFolder() {
        this.seriesService.GetFilesInFolder(this.FilePath)
            .then((result: string[]) => {
                this.Files = result;
            });
    }

    link() {
        this.seriesService.LinkToFolder(this.Series, this.FilePath, this.SelectedFile);
        this.$mdDialog.hide(this.Series);
    }
}

class PickSeriesController {

    static $inject = ['$mdDialog', 'seriesService', 'series'];

    Series: Array<ISeries>;
    SelectedSeries: ISeries;
    SearchTerm: string;

    constructor(
        private $mdDialog: ng.material.IDialogService,
        private seriesService: SeriesService,
        private series: ISeries) {
        seriesService.GetAll()
            .then((result: ISeries[]) => this.Series = result);
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    query(searchTerm: string) {
        return searchTerm ? this.Series.filter(this.createFilterFor(searchTerm) ) : this.Series;
    }

    createFilterFor(query: string) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(series: ISeries) {
        return (series.Name.toLowerCase().indexOf(lowercaseQuery) === 0);
      };

    }

    link() {
        var match = _(this.Series).filter((s: ISeries) => s.Name == this.SearchTerm).first();
        if(match === undefined) {
            return;
        }

        this.$mdDialog.hide(this.SelectedSeries);
    }

} 