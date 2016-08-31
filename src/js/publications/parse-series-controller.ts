import {app} from '../checklist-app';

export class ParseSeriesController {

    static $inject = ['$uibModalInstance', 'pub'];

    issuesText: string;

    constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private pub: any) {
        this.issuesText = pub;
    }

    cancel() {
        this.$uibModalInstance.dismiss('cancel');
    }

}