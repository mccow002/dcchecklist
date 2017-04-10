import { IIssue } from './issue-model';

export class IssueService {

    static $inject = ['$q', '$http', 'socket', 'CacheFactory', 'pubsub'];

    PagesCache: any;
    PageLoadedCallback: (args: any) => void;

    constructor(
        private $q: ng.IQService, 
        private $http: ng.IHttpService,
        private socket: any,
        private CacheFactory: any,
        private pubsub: any) {
            // if (!CacheFactory.get('pagesCache')) {
            //     this.PagesCache = CacheFactory('pagesCache', {
            //         maxAge: 60 * 60 * 1000, // 1 hour
            //         storageMode: 'sessionStorage'
            //     });
            // }
        }

    public GetIssue(issueId: string): ng.IPromise<IIssue> {
        let q = this.$q.defer();
        let req = this.$http.get('/issuesapi/' + issueId);

        req.success((issue: ng.IHttpPromiseCallback<IIssue>) => {
            q.resolve(issue);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public LinkToFile(issue: IIssue): ng.IPromise<IIssue> {
        let q = this.$q.defer();
        let req = this.$http.put('/issuesapi/link', issue);

        req.success((issue: ng.IHttpPromiseCallback<IIssue>) => {
            q.resolve(issue);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public Open(issue: IIssue): ng.IPromise<any> {
        let q = this.$q.defer();
        let req = this.$http.get('/readerapi/'+ issue._id);

        req.success(() => {
            q.resolve();
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public GetMetadata(issue: IIssue): ng.IPromise<IIssue> {
        let q = this.$q.defer();
        setTimeout(() => q.resolve(), 1000);
        // let req = this.$http.post('/issuesapi/metadata', issue);

        // req.success((result: IIssue) => {
        //     q.resolve(result);
        // });

        // req.error(() => {
        //     q.reject();
        // });

        return q.promise;
    }

    public GetPage(filePath: String, page: string, issueId: string, currentPage: number) {
        // if(this.PagesCache.get(page) !== undefined){
        //     this.PageLoadedCallback(this.PagesCache.get(page));
        //     console.log('Page loaded from cache...');
        //     return;
        // }

        console.log('Emitting getPage...');
        this.socket.emit('getPage', {
                filePath: filePath,
                page: page,
                issueId: issueId,
                currentPage: currentPage
            });
    }

    public RegisterPageLoaded(cb: (args: any) => void) {
        this.PageLoadedCallback = cb;
        this.pubsub.subscribe('pageLoaded', (args: any) => {
            //console.log('Putting page into cache...');
            //this.PagesCache.put(args.page, args.imageStr);
            console.log('pageLoaded Recieved...');
            cb(args.imageStr);
        });
    }

    public RegisterPagesLoaded(cb: (args: any) => void) {
        this.pubsub.subscribe('pagesLoaded', (args: any) => {
            console.log('pagesLoaded Recieved...');
            cb(args);
        });
    }
}