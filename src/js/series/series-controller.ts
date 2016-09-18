import { SeriesService } from './series-service';
import { ISeries } from './series-model';
import { IPublication } from '../publications/publication-model';

export class SeriesController {

    static $inject = ['$mdDialog', '$state', 'seriesService', 'toastr'];

    Series: Array<ISeries>;

    constructor(
        private $mdDialog: ng.material.IDialogService,
        private $state: ng.ui.IStateService,
        private seriesService: SeriesService,
        private toastr: ng.toastr.IToastrService) {
        seriesService.GetAll()
            .then((series: ISeries[]) => {
                this.Series = series;
            });
    }

    addSeries(ev: any) {
        this.$mdDialog.show({
            controller: 'parseSeriesCtrl as ps',
            templateUrl: '/dist/views/parseSeries.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            locals: {
                pub: null
            }
        })
        .then((series: ISeries) => {
                this.toastr.success('Series Added!');
                this.$state.go('seriesDetails', {seriesId: series._id});
            });
    }
}