export module Directives {
    export function Keypress(
        $document: ng.IDocumentService, 
        $rootScope: ng.IRootScopeService) {
            return {
                restrict: 'A',
                scope: {
                    onKeydown: '&'
                },
                link: (scope: any, e: ng.IRootElementService) => {
                    //console.log('Binding Keydown Directive...');
                    $document.on('keydown', (e) => {
                        scope.onKeydown({$event: e.which});
                    });

                    scope.$on('$destroy', () => {
                        $document.off('keydown');
                    });

                    e.on('$destroy', () => {
                        $document.off('keydown');
                    });
                }
            }
    }
    Keypress.$inject = ['$document', '$rootScope'];
}