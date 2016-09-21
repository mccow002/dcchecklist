export module Directives {
    export function RemainingHeight($window: ng.IWindowService, $mdMedia: ng.material.IMedia) {
        var calcHeight = (e: ng.IRootElementService) => {
            if(!$mdMedia('gt-md')) {
                $(e[0]).css('height', '');
                return;
            }

            var header = $('#header').height();
            var seriesHeader = $('#series-header').height() || 0;
            var windowHeight = $window.innerHeight;
            var bodyMargin = parseInt($('body').css('paddingTop'));

            $(e[0]).height(windowHeight - header - seriesHeader - bodyMargin);
        }

        return {
            restrict: 'A',
            link: (scope: ng.IScope, e: ng.IRootElementService) => {
                let calc = () => calcHeight(e);
                calc();

                angular.element($window).bind('resize', calc);

                scope.$on('$destroy', () => {
                        angular.element($window).unbind('resize', calc);
                    });
            }
        }
    }

    RemainingHeight.$inject = ['$window', '$mdMedia'];
}