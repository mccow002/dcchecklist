interface IResizeScope extends ng.IScope {
    onResize: () => void;
}

export module Directives {
    export function WindowResize($window: ng.IWindowService) {
        return {
            restrict: 'A',
            scope: {
                onResize: '&'
            },
            link: (scope: IResizeScope, e: ng.IRootElementService, attrs: any) => {
                angular.element($window).bind('resize', scope.onResize);

                scope.$on('$destroy', () => {
                        angular.element($window).unbind('resize', scope.onResize);
                    });
            }
        }
    }
}