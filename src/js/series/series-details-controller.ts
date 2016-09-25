import * as _ from 'lodash';
import { SeriesService } from './series-service';
import { ISeries } from './series-model';
import { IIssue } from '../issues/issue-model';

interface ISeriesDetailsRouteParams extends ng.ui.IStateParamsService {
    seriesId: string
}

export class SeriesDetailsController {

    static $inject = ['$stateParams', '$state', '$uibModal', '$mdDialog', '$mdSidenav', '$window', 'toastr', 'seriesService'];

    Series: ISeries;
    route: string;
    LoadingSeries: boolean = true;
    
    EditMode: boolean = false;
    SelectedIssues: Array<IIssue>;
    Filters: Filters = new Filters();;

    constructor(
        private $stateParams: ISeriesDetailsRouteParams,
        private $state: ng.ui.IStateService,
        private $uibModal: ng.ui.bootstrap.IModalService,
        private $mdDialog: ng.material.IDialogService,
        private $mdSidenav: ng.material.ISidenavService,
        private $window: ng.IWindowService,
        private toastr: ng.toastr.IToastrService,
        private seriesService: SeriesService) {
            this.SelectedIssues = new Array<IIssue>();

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

    toggleEditMode() {
        this.EditMode = !this.EditMode;
    }

    getEditBtnText() {
        return this.EditMode ? 'Done' : 'Edit';
    }

    getIssueName(issue: IIssue) {
        var issueLabel = this.Series.Name;
        if(issue.Type){
            issueLabel += ' ' + issue.Type;
        }

        return issueLabel + ' - ' + issue.Number;
    }

    filterIssue() {
        if(this.Filters.NoFilters()){
            return this.Series.Issues;
        }

        let linkFilter = (i: IIssue): boolean => {
            if(this.Filters.LinkFilter === 'Linked'){
                return i.FilePath !== undefined || i.FilePath !== '';
            } else if(this.Filters.LinkFilter === 'Not Linked'){
                return i.FilePath === undefined || i.FilePath === '';
            } else {
                return true;
            }

        }

        return _(this.Series.Issues).filter((i: IIssue) => {
            if(i.Type === undefined) {
                return this.Filters.Filters.indexOf("Issue") > -1 && linkFilter(i);
            }

            return this.Filters.Filters.indexOf(i.Type) > -1 && linkFilter(i);
        }).value();
    }

    goToIssue(issue: IIssue) {
        if(this.EditMode){
            let i = this.SelectedIssues.indexOf(issue);
            if(i > -1) {
                this.SelectedIssues.splice(i, 1)
            } else {
                this.SelectedIssues.push(issue);
            }
        } else {
            this.$state.go('seriesDetails.Issue', {issueId: issue._id})
                .then(() => {
                    let sideNav = this.$mdSidenav('left');
                    if(sideNav.isOpen() && !sideNav.isLockedOpen()) {
                        sideNav.close();
                    }
                });
        }
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

    applyFilter(ev: any) {
        this.$mdDialog.show({
            controller: FilterIssuesController,
            controllerAs: 'fi',
            templateUrl: '/dist/views/filter-issues.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                series: this.Series,
                filters: this.Filters
            }
        })
        .then((result: Filters) => this.Filters = result); 
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

class FilterIssuesController {

    static $inject = ['$mdDialog', 'series', 'filters'];

    Types: Array<string>;
    Selected: Array<string> = new Array<string>();
    LinkFilterData: Array<string>;
    LinkFilter: string;

    constructor(private $mdDialog: ng.material.IDialogService,
        private series: ISeries,
        private filters: Filters) {
            this.LinkFilterData = ['All', 'Linked', 'Not Linked'];
            
            this.Selected = filters.Filters;
            this.LinkFilter = filters.LinkFilter;

            this.Types = _(series.Issues)
                .map(i => {
                    if(i.Type === undefined){
                        return 'Issue';
                    } else {
                        return i.Type;
                    }
                })
                .uniq()
                .value();
        }

    toggle(type: string) {
        let i = this.Selected.indexOf(type);
        if(i > -1) {
            this.Selected.splice(i, 1)
        } else {
            this.Selected.push(type);
        }
    }

    applyFilter() {
        let filters = new Filters();
        filters.Filters = this.Selected;
        filters.LinkFilter = this.LinkFilter;

        this.$mdDialog.hide(filters);
    }

}

class Filters {
    Filters: Array<string> = new Array<string>();
    LinkFilter: string = 'All';

    NoFilters(): boolean {
        return this.Filters.length === 0 && this.LinkFilter === 'All';
    }
}