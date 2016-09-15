import { IIssue } from './issue-model';
import { IssueService } from './issue-service';
import { ReaderPresenter } from './reader-controller';

interface IIssueRouteParams extends ng.ui.IStateParamsService {
    issueId: string;
    seriesName: string;
}

export class IssueDetailsController {

    static $inject = ['$scope', '$stateParams', '$mdDialog', '$window', '$rootScope', '$state', 'toastr', 'issueService', 'Months', 'readerPresenter'];

    Issue: IIssue;
    LoadingMetadata: boolean = false;

    constructor(
        private $scope: ng.IScope,
        private $stateParams: IIssueRouteParams,
        private $mdDialog: ng.material.IDialogService,
        private $window: ng.IWindowService,
        private $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        private toastr: ng.toastr.IToastrService,
        private issueService: IssueService,
        private Months: Array<string>,
        private readerPresenter: ReaderPresenter
    ) {
        issueService.GetIssue($stateParams.issueId)
            .then((result: IIssue) => this.Issue = result);
    }

    getCoverUrl() {
        if(this.Issue.FilePath !== undefined) {
            return '/readerapi/cover/' + this.Issue._id;
        }
    }

    linkIssue($event: any) {
        $event.stopPropagation();

        var linkPrompt = this.$mdDialog.prompt()
            .title('Link Issue')
            .placeholder('File Path')
            .ariaLabel('File Path')
            .initialValue(this.Issue.FilePath)
            .targetEvent($event)
            .ok('Link')
            .cancel('Cancel')
            .parent(angular.element(document.body));

        this.$mdDialog.show(linkPrompt)
            .then((result) => {
                console.log(result);
                this.Issue.FilePath = result;
                this.issueService.LinkToFile(this.Issue)
                    .then((issue: IIssue) => {
                        this.toastr.success('File Successfully Linked!');
                    })
            });
    }

    getMetadata() {
        this.LoadingMetadata = true;
        this.issueService.GetMetadata(this.Issue)
            .then((result) => {
                this.Issue = result;
                console.log(this.Issue);
                this.toastr.success('Metadata loaded!');
                this.LoadingMetadata = false;
                //this.$state.reload();
            }, () => {
                this.LoadingMetadata = false;
                this.toastr.error('Unable to load metadata!');
            })
    }

    getMonth(month: number) {
        return this.Months[month - 1];
    }

    open(ev: any) {
        this.readerPresenter.Open(this.Issue, ev);
        // this.issueService.Open(this.Issue);
        // this.ViewerOpen = true;
    }
}