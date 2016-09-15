export module Directives {
    export function RemainingHeight($window: ng.IWindowService) {
        var calcHeight = (e: ng.IRootElementService) => {
            var header = $('#header').height();
            var seriesHeader = $('#series-header').height();
            var windowHeight = $window.innerHeight;
            var bodyMargin = parseInt($('body').css('paddingTop'));

            $(e[0]).height(windowHeight - header - seriesHeader - bodyMargin);
        }

        return {
            restrict: 'A',
            link: (scope: ng.IScope, e: ng.IRootElementService) => {
                calcHeight(e);
            }
        }
    }

    RemainingHeight.$inject = ['$window'];
}