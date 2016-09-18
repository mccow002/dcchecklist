import {app} from '../checklist-app';
import { IParseIssueResult, ParseSeries } from './series-parser';
import { IPublication } from '../publications/publication-model';
import { IIssue, Issue } from '../issues/issue-model';
import { ISeries, Series } from '../series/series-model';
import { SeriesService } from '../series/series-service';

class Issues {
    Title: string;
    First: number;
    Last: number;
    Volume: number;
    VolumeType: string;
}

interface IParseSeriesScope {
    form: ng.IFormController
}

export class ParseSeriesPresenter {
    static $inject = ['$mdDialog'];

    constructor(private $mdDialog: ng.material.IDialogService) {

    }

    public Open(publication: IPublication, ev: any): ng.IPromise<ISeries> {
        return this.$mdDialog.show({
            controller: ParseSeriesController,
            controllerAs: 'ps',
            templateUrl: '/dist/views/parseSeries.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                pub: publication
            }
        });
    }
}

export class ParseSeriesController {

    static $inject = ['$scope', '$mdDialog', 'pub', 'seriesService', 'Months'];

    publication: IPublication;
    issues: Issues;
    Years: Array<number> = [];

    StartMonth: string;
    StartYear: number;
    EndMonth: string;
    EndYear: number;

    constructor(
        private $scope: IParseSeriesScope,
        private $mdDialog: ng.material.IDialogService, 
        private pub: IPublication, 
        private seriesService: SeriesService,
        private Months: Array<string>) {
        this.publication = pub;
        this.issues = new Issues();

        if(pub !== null)
        {
            let parser = new ParseSeries();
            let result = parser.ParseIssues(pub);
            this.issues.First = result.First;
            this.issues.Last = result.Last;
            this.issues.Title = pub.Title;

            let dateResult = parser.ParseDate(pub);
            console.log(JSON.stringify(dateResult));
            if(dateResult.Success) {
                console.log(dateResult.Start.getMonth());
                this.StartMonth = this.Months[dateResult.Start.getMonth()];
                this.StartYear = dateResult.Start.getFullYear();
                this.EndMonth = this.Months[dateResult.End.getMonth()];
                this.EndYear = dateResult.End.getFullYear();
            }

            if(pub.Series === '') {
                this.issues.Volume = 1;
            } else {
                var volReg = new RegExp('[0-9]+', 'g');
                let r = volReg.exec(pub.Series);

                this.issues.Volume = Number(r[0]);
            }
        }

        for(let y = 1938; y <= new Date().getFullYear(); y++) {
            this.Years.push(y);
        }
    }

    getWidthClass() {
        return this.publication === null ? 'col-md-12' : 'col-md-6';
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    parse() {
        if(!this.$scope.form.$valid){
            return;
        }

        let series = new Series(this.issues.Title, this.issues.Volume);
        series.StartDate = new Date(this.StartYear, this.Months.indexOf(this.StartMonth));
        series.EndDate = new Date(this.EndYear, this.Months.indexOf(this.EndMonth));

        if(this.issues.VolumeType !== ''){
            series.SeriesType = this.issues.VolumeType;
        }

        for(let i = this.issues.First; i <= this.issues.Last; i++) {
            let issue = new Issue(i);
            series.Issues.push(issue);
        }

        this.seriesService.Create(series)
            .then((result) => this.$mdDialog.hide(result));
    }

}