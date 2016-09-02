import {app} from '../checklist-app';
import { IParseResult, ParseSeries } from './series-parser';
import { IPublication } from './publication-model';
import { IIssue, Issue } from '../series/issue-model';
import { ISeries, Series } from '../series/series-model';
import { SeriesService } from '../series/series-service';

class Issues {

    constructor(first: number, last: number) {
        this.First = first;
        this.Last = last;
    }

    First: number;
    Last: number;
    Volume: number;
    VolumeType: string;
}

export class ParseSeriesController {

    static $inject = ['$uibModalInstance', 'pub', 'seriesService'];

    publication: IPublication;
    issues: Issues;

    constructor(
        private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, 
        private pub: IPublication, 
        private seriesService: SeriesService) {
        //pub.Title = "WHOO!";
        this.publication = pub;

        let parser = new ParseSeries();
        let result = parser.Parse(pub);
        this.issues = new Issues(result.First, result.Last);

        if(pub.Series === '') {
            this.issues.Volume = 1;
        } else {
            var volReg = new RegExp('[0-9]+', 'g');
            let r = volReg.exec(pub.Series);

            this.issues.Volume = Number(r[0]);
        }
    }

    cancel() {
        this.$uibModalInstance.dismiss('cancel');
    }

    parse() {
        let series = new Series(this.pub.Title, this.issues.Volume);

        if(this.issues.VolumeType !== ''){
            series.SeriesType = this.issues.VolumeType;
        }

        for(let i = this.issues.First; i <= this.issues.Last; i++) {
            let issue = new Issue(i);
            series.Issues.push(issue);
        }

        this.seriesService.Create(series);
    }

}