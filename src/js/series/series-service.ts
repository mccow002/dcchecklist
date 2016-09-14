import {app} from '../checklist-app';
import { ISeries } from './series-model';

export class SeriesService {

    static $inject = ['$q', '$http'];

    constructor(private $q: ng.IQService, private $http: ng.IHttpService) {}

    public GetAll(): ng.IPromise<ISeries[]> {
        let q = this.$q.defer();
        let req = this.$http.get('/seriesapi');

        req.success((series: ng.IHttpPromiseCallback<ISeries[]>) => {
            q.resolve(series);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public GetOne(seriesId: string): ng.IPromise<ISeries> {
        let q = this.$q.defer();
        let req = this.$http.get('/seriesapi/' + seriesId);

        req.success((series: ng.IHttpPromiseCallback<ISeries[]>) => {
            q.resolve(series);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public Create(series: ISeries): ng.IPromise<ISeries> {
        let q = this.$q.defer();
        let req = this.$http.post('/seriesapi/create/', series);

        req.success((series: ng.IHttpPromiseCallback<ISeries>) => {
            q.resolve(series);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public GetFilesInFolder(folderPath: string): ng.IPromise<string[]> {
        let q = this.$q.defer();
        let req = this.$http.post('/seriesapi/getFilesInDir', {
            folder: folderPath    
        });

        req.success((files: ng.IHttpPromiseCallback<string[]>) => {
            q.resolve(files);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public LinkToFolder(series: ISeries, folderPath: string, filePattern: string): ng.IPromise<ISeries> {
        let q = this.$q.defer();
        let req = this.$http.post('/seriesapi/linkToFolder/', {
            Series: series,
            FolderPath: folderPath,
            FilePattern: filePattern
        });

        req.success((series: ng.IHttpPromiseCallback<ISeries>) => {
            q.resolve(series);
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

    public DeleteSeries(seriesId: string) {
        let q = this.$q.defer();
        let req = this.$http.delete('/seriesapi/' + seriesId);

        req.success(() => {
            q.resolve();
        });

        req.error(() => {
            q.reject();
        });

        return q.promise;
    }

}