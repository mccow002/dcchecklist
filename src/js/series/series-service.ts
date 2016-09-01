import {app} from '../checklist-app';
import { ISeries } from './series-model';

export class SeriesService {

    static $inject = ['$q', '$http'];

    constructor(private $q: ng.IQService, private $http: ng.IHttpService) {}

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

}