export module Directives {
    export function SpinnerOnLoad() {
        return {
            restrict: 'A',
            scope: {
                ngSrc: '='
            },
            link: (scope: ng.IScope, element: ng.IRootElementService) => {
                element.on('load', () => {
                    alert('Loaded!');
                });
                scope.$watch('ngSrc', () => {
                    alert('Spinning!');
                });
            }
        }
    }
}