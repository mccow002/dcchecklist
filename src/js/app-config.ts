import { PublicationsController } from './publications/publications-controller';

export class AppConfig {

    static $inject = ['$stateProvider', '$urlRouterProvider'];

    constructor($stateProvider: ng.ui.IStateProvider,
        $urlRouteProvider: ng.ui.IUrlRouterProvider){
            $stateProvider
                .state('publications', {
                    url: '/publications/:sort?',
                    templateUrl: '/dist/views/publications.html',
                    controller: 'publicationsCtrl as ck'
                })
                .state('series', {
                    url: '/series',
                    templateUrl: '/dist/views/series.html',
                    controller: 'seriesCtrl'
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
                        console.log('exitings....');
                        pubsub.unsubAll();
                        //$document.unbind('keydown');
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