import { SeriesService } from './series-service';
import { ISeries } from './series-model';
import { IPublication } from '../publications/publication-model';

export class SeriesController {

    static $inject = ['$uibModal', '$state', 'seriesService', 'toastr'];

    Series: Array<ISeries>;

    constructor(
        private $uibModal: ng.ui.bootstrap.IModalService,
        private $state: ng.ui.IStateService,
        private seriesService: SeriesService,
        private toastr: ng.toastr.IToastrService) {
        seriesService.GetAll()
            .then((series: ISeries[]) => {
                this.Series = series;
            });
    }

    addSeries() {
        let mi = this.$uibModal.open({
            controller: 'parseSeriesCtrl as ps',
            templateUrl: '/dist/views/parseSeries.html',
            resolve: {
                pub: () => <IPublication>null
            }
        });

        mi.result.then((series: ISeries) => {
            this.toastr.success('Series Added!');
            this.$state.go('series');
        });
    }
}