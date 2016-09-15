import { SeriesService } from './series-service';
import { ISeries } from './series-model';

interface ISeriesDetailsRouteParams extends ng.ui.IStateParamsService {
    seriesId: string
}

export class SeriesDetailsController {

    static $inject = ['$stateParams', '$state', '$uibModal', '$mdDialog', '$mdSidenav', '$window', 'toastr', 'seriesService'];

    Series: ISeries;
    route: string;

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
                this.$state.go('seriesDetails.Issue', {
                    seriesId: $stateParams.seriesId,
                    issueId: series.Issues[0]._id
                });
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

    linkSeries() {
        var mi = this.$uibModal.open({
            controller: 'linkSeriesCtrl as ls',
            templateUrl: '/dist/views/link-series.html',
            resolve: {
                series: () => this.Series
            }
        });

        mi.result.then((result: ISeries) => {
            this.Series = result;
            this.toastr.success('File Successfully Linked!');
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
}

export class LinkSeriesController {
    
    static $inject = ['$uibModalInstance', 'seriesService', 'toastr', 'series'];

    Series: ISeries;
    FilePath: string;
    Files: Array<string>;
    SelectedFile: string;

    constructor(
        private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
        private seriesService: SeriesService,
        private toastr: ng.toastr.IToastrService,
        private series: ISeries) {
            this.Series = series;
            this.FilePath = '';
            this.SelectedFile = '';
            this.Files = new Array<string>();
        }

    cancel() {
        this.$uibModalInstance.dismiss('cancel');
    }

    scanFolder() {
        this.seriesService.GetFilesInFolder(this.FilePath)
            .then((result: string[]) => {
                this.Files = result;
            });
    }

    link() {
        this.seriesService.LinkToFolder(this.Series, this.FilePath, this.SelectedFile);
        this.$uibModalInstance.close(this.Series);
    }
}