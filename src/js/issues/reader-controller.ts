import { IIssue } from './issue-model';
import { IssueService } from './issue-service';

export class ReaderPresenter {
    
    static $inject = ['$mdDialog'];

    constructor(private $mdDialog: ng.material.IDialogService) {

    }

    public Open(issue: IIssue, ev: any) {
        this.$mdDialog.show({
            controller: ReaderController,
            controllerAs: 'rc',
            templateUrl: '/dist/views/reader.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            locals: {
                issue: issue
            }
        });
    }
}

export class ReaderController {

    static $inject = ['$scope', '$mdDialog', 'issue', '$window', 'issueService'];

    IssuePages: string[];
    CurrentPage: number = 0;
    ViewerImage: string;
    PageLoading: boolean = true;
    Progress: string;
    ViewerHeight: string;

    constructor(private $scope: ng.IScope,
        private $mdDialog: ng.material.IDialogService,
        private Issue: IIssue,
        private $window: ng.IWindowService,
        private issueService: IssueService) {
        this.ViewerHeight = ($window.innerHeight - 15) + 'px';
        
        this.issueService.RegisterPagesLoaded((args: any) => {
            this.IssuePages = args;
            this.getPage();
        });

        this.issueService.RegisterPageLoaded((args: any) => {
            this.Progress = this.calcWidth();
            this.PageLoading = false;
            this.ViewerImage = args;
        });

        this.issueService.Open(this.Issue);
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

    closeViewer() {
        this.$mdDialog.cancel();
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

    onResize() {
        this.$scope.$apply(() => {
            this.ViewerHeight = (this.$window.innerHeight - 15) + 'px';
        });
    }
}