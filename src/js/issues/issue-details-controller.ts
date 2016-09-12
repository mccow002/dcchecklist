import { IIssue } from './issue-model';
import { IssueService } from './issue-service';

interface IIssueRouteParams extends ng.ui.IStateParamsService {
    issueId: string;
}

export class IssueDetailsController {

    static $inject = ['$scope', '$stateParams', '$uibModal', '$window', '$rootScope', '$state', 'toastr', 'issueService', 'Months'];

    Issue: IIssue;
    IssuePages: string[];
    CurrentPage: number;
    ViewerImage: string;
    ViewerOpen: boolean;
    ViewerHeight: string;
    PageLoading: boolean;
    Progress: string;

    constructor(
        private $scope: ng.IScope,
        private $stateParams: IIssueRouteParams,
        private $uibModal: ng.ui.bootstrap.IModalService,
        private $window: ng.IWindowService,
        private $rootScope: ng.IRootScopeService,
        private $state: ng.ui.IStateService,
        private toastr: ng.toastr.IToastrService,
        private issueService: IssueService,
        private Months: Array<string>
    ) {
        this.CurrentPage = 0;
        this.ViewerOpen = false;
        this.ViewerHeight = ($window.innerHeight - 15) + 'px';
        this.PageLoading = true;

        issueService.GetIssue($stateParams.issueId)
            .then((result: IIssue) => this.Issue = result);
        
        this.issueService.RegisterPagesLoaded((args: any) => {
            this.IssuePages = args;
            this.getPage();
        });

        this.issueService.RegisterPageLoaded((args: any) => {
            this.Progress = this.calcWidth();
            this.PageLoading = false;
            this.ViewerImage = args;
        });
    }

    getCoverUrl() {
        if(this.Issue.FilePath !== undefined) {
            return '/readerapi/cover/' + this.Issue._id;
        }
    }

    getPage() {
        this.PageLoading = true;
        this.issueService.GetPage(
            this.Issue.FilePath,
            this.IssuePages[this.CurrentPage]);
    }

    calcWidth() {
        let progress = (((this.CurrentPage + 1) / this.IssuePages.length) * 100);
        console.log(this.CurrentPage + ' / ' + this.IssuePages.length + ' * 100 = ' + progress);
        return progress + '%';
    }

    linkIssue($event: ng.IAngularEvent) {
        $event.stopPropagation();
        
        var mi = this.$uibModal.open({
            controller: 'linkIssueCtrl as li',
            templateUrl: '/dist/views/link-issue.html',
            resolve: {
                issue: () => this.Issue
            }
        });

        mi.result.then((result: IIssue) => {
            this.Issue = result;
            this.toastr.success('File Successfully Linked!');
        });
    }

    getMetadata() {
        this.issueService.GetMetadata(this.Issue)
            .then((result) => {
                this.Issue = result;
                console.log(this.Issue);
                this.toastr.success('Metadata loaded!');
                this.$state.reload();
            })
    }

    getMonth(month: number) {
        return this.Months[month - 1];
    }

    open() {
        this.issueService.Open(this.Issue);
        this.ViewerOpen = true;
    }

    closeViewer() {
        console.log('closing viewer...');
        this.ViewerOpen = false;
    }

    next() {
        if(this.CurrentPage === this.IssuePages.length - 1) {
            return;
        }

        this.CurrentPage = this.CurrentPage + 1;
        this.getPage();
    }

    previous() {
        if(this.CurrentPage === 0) {
            return;
        }
        
        this.CurrentPage = this.CurrentPage - 1;
        this.getPage();
    }

    handleKeydown(key: number) {
        if(key === 39) {
            this.$scope.$apply(() => this.next());
        } else if (key === 37) {
            this.$scope.$apply(() => this.previous());
        } else if (key === 27) {
            this.$scope.$apply(() => this.closeViewer());
        }
    }
}

export class LinkIssueController {

    static $inject = ['$uibModalInstance', 'issueService', 'issue'];

    Issue: IIssue;

    constructor(
        private $uibModalInstance: ng.ui.bootstrap.IModalServiceInstance,
        private issueService: IssueService,
        private issue: IIssue) {
            this.Issue = issue;
        }

    cancel() {
        this.$uibModalInstance.dismiss('cancel');
    }

    link() {
        this.issueService.LinkToFile(this.Issue);
        this.$uibModalInstance.close(this.Issue);
    }
}