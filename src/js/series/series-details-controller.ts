import { SeriesService } from './series-service';
import { ISeries } from './series-model';

interface ISeriesDetailsRouteParams extends ng.ui.IStateParamsService {
    seriesId: string
}

export class SeriesDetailsController {

    static $inject = ['$stateParams', '$state', '$uibModal', 'toastr', 'seriesService'];

    Series: ISeries;

    constructor(
        private $stateParams: ISeriesDetailsRouteParams,
        private $state: ng.ui.IStateService,
        private $uibModal: ng.ui.bootstrap.IModalService,
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