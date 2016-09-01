import {app} from '../checklist-app';
import { IParseResult, ParseSeries } from './series-parser';
import { IPublication } from './publication-model';

class Issues {

    constructor(first: number, last: number) {
        this.First = first;
        this.Last = last;
    }

    First: number;
    Last: number;
}

export class ParseSeriesController {

    static $inject = ['$uibModalInstance', 'pub'];

    issuesText: string;
    issues: Issues;

    constructor(private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, private pub: IPublication) {
        this.issuesText = pub.Issues;

        let parser = new ParseSeries();
        let r = parser.Parse(pub    );
        this.issues = new Issues(r.First, r.Last);
    }

    cancel() {
        this.$uibModalInstance.dismiss('cancel');
    }

}