import {app} from '../checklist-app';

export class PubService {

    static $inject = ['$q', '$http'];

    constructor(private $q: ng.IQService, private $http: ng.IHttpService) {}

    public load(index: String): ng.IPromise<any>{
        let q = this.$q.defer();
        let req = this.$http.get('/api/getall/' + index);

        req.success((data: any) => {
            q.resolve(data.pubs);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    } 

    public Put(pub: any): ng.IPromise<any> {
        var q = this.$q.defer();
        var req = this.$http.put('/api/', pub);

        req.success(() => {
            q.resolve();
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public Delete(pub: any): ng.IPromise<any> {
        var q = this.$q.defer();
        let req = this.$http.delete('/api/' + pub._id);

        req.success(() => {
            q.resolve();
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }
}