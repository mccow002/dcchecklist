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
            //fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
                alert('creating series!');
                //$scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                //$scope.status = 'You cancelled the dialog.';
        });

        // let mi = this.$uibModal.open({
        //     controller: 'parseSeriesCtrl as ps',
        //     templateUrl: '/dist/views/parseSeries.html',
        //     resolve: {
        //         pub: () => <IPublication>null
        //     }
        // });

        // mi.result.then((series: ISeries) => {
        //     this.toastr.success('Series Added!');
        //     this.$state.go('series');
        // });
    }
}