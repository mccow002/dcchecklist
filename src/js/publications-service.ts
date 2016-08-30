import {app} from './checklist-app';

export class PubService {

    static $inject = ['$q', '$http'];

    constructor(private $q: ng.IQService, private $http: ng.IHttpService) {}

    load(index: String){
        var q = this.$q.defer();
        var req = this.$http.get('/api/getall/' + index);

        req.success((data: any) => {
            q.resolve(data.comics);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    } 
}