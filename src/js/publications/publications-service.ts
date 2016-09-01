import {app} from '../checklist-app';
import { IPublication } from './publication-model';

export class PubService {

    static $inject = ['$q', '$http'];

    constructor(private $q: ng.IQService, private $http: ng.IHttpService) {}

    public load(index: String): ng.IPromise<IPublication[]>{
        let q = this.$q.defer();
        let req = this.$http.get('/pubapi/getall/' + index);

        req.success((data: ng.IHttpPromiseCallback<IPublication[]>) => {
            q.resolve(data);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    } 

    public Search(search: string): ng.IPromise<IPublication[]>{
        var q = this.$q.defer();
        var req = this.$http.get('/pubapi/search/' + search);

        req.success(function(data: ng.IHttpPromiseCallback<IPublication[]>){
            q.resolve(data);
        });

        req.error(function(){
            q.reject();
        });

        return q.promise;
    }

    public Put(pub: any): ng.IPromise<IPublication> {
        var q = this.$q.defer();
        var req = this.$http.put('/pubapi/', pub);

        req.success(() => {
            q.resolve();
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public Delete(pub: any): ng.IPromise<IPublication> {
        var q = this.$q.defer();
        let req = this.$http.delete('/pubapi/' + pub._id);

        req.success(() => {
            q.resolve();
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }
}