export module Directives {
    export function Keypress(
        $document: ng.IDocumentService, 
        $rootScope: ng.IRootScopeService) {
            return {
                restrict: 'A',
                scope: {
                    onKeydown: '&'
                },
                link: (scope: any, e: ng.IRootElementService, attr: any) => {
                    //console.log('Binding Keydown Directive...');
                    $document.on('keydown', (e) => {
                        //$rootScope.$broadcast('keypress', e, e.which)
                        scope.onKeydown({$event: e.which});
                    });

                    scope.$on('$destroy', () => {
                        console.log('scope destroy!');
                        $document.off('keydown');
                    });

                    e.on('$destroy', () => {
                        console.log('element destroy!');
                        $document.off('keydown');
                    });
                }
            }
    }
    Keypress.$inject = ['$document', '$rootScope'];
}