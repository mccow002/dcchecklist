import { PublicationsController } from './publications/publications-controller';
import * as http from './http-interceptor-factory';

export class AppConfig {

    static $inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider', '$mdThemingProvider', 'localStorageServiceProvider'];

    constructor($stateProvider: ng.ui.IStateProvider,
        $urlRouteProvider: ng.ui.IUrlRouterProvider,
        $httpProvider: ng.IHttpProvider,
        $mdThemingProvider: ng.material.IThemingProvider,
        localStorageServiceProvider: ng.local.storage.ILocalStorageServiceProvider){
            $httpProvider.interceptors.push('httpInterceptor');

            localStorageServiceProvider.setPrefix('comics-app');

            $stateProvider
                .state('publications', {
                    url: '/publications/:sort?',
                    templateUrl: '/dist/views/publications.html',
                    controller: 'publicationsCtrl as ck'
                })
                .state('publicationsSearch', {
                    url: '/publications/search/:searchTerm',
                    templateUrl: '/dist/views/publications.html',
                    controller: 'publicationsCtrl as ck'
                })
                .state('series', {
                    url: '/series',
                    templateUrl: '/dist/views/series.html',
                    controller: 'seriesCtrl as sr'
                })
                .state('seriesDetails', {
                    url: '/series/:seriesId',
                    templateUrl: '/dist/views/series-details.html',
                    controller: 'seriesDetailsCtrl' 
                })
                .state('seriesDetails.Issue', {
                    url: '/:issueId',
                    templateUrl: '/dist/views/issue-details.html',
                    controller: 'issueDetailsCtrl as id',
                    resolve: {
                        pubsub: (pubsub: any) => pubsub,
                        $document: ($document: ng.IDocumentService) => $document
                    },
                    onExit: (pubsub: any, $document: ng.IDocumentService) => {
                        pubsub.unsubAll();
                    } 
                })
                .state('collection', {
                    url: '/collection',
                    templateUrl: '/dist/views/collection.html',
                    controller: 'collectionCtrl as c'
                });

            $urlRouteProvider.otherwise('/publications/0-9');
    }
}