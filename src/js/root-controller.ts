

export class RootController {

    static $inject = ['$rootScope', '$state', 'pubsub'];

    CurrentRoute: string;

    constructor(
        $rootScope: ng.IRootScopeService, 
        $location: ng.ILocationService, 
        $state: ng.ui.IState,
        pubsub: any){
        $rootScope.$on('$stateChangeSuccess ', (scope, current, pre) => {
            //console.log(JSON.stringify($state));
            console.log('State Changed!');
            pubsub.unsubAll();
        })
    }

}