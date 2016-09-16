interface ISpinnerScope extends ng.IScope {
    onLoad: () => void
}

export module Directives {
    export function SpinnerOnLoad() {
        return {
            restrict: 'A',
            scope: {
                ngSrc: '=',
                onLoad: '&'
            },
            link: (scope: ISpinnerScope, element: ng.IRootElementService) => {
                element.on('load', () => {
                    scope.onLoad();
                });
                scope.$watch('ngSrc', () => {
                    
                });
            }
        }
    }
}