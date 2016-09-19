export module Directives {
    export function InputClear() {
        return {
            restrict: 'A',
            compile: (e: ng.IRootElementService, attrs: any) => {
                var color = attrs.inputClear;
                var style = color ? "color:" + color + ";" : "";
                var action = attrs.onClear;
                e.after(
                    '<md-button class="animate-show md-icon-button"' +
                    'ng-show="' + attrs.ngModel + '" ng-click="' + action + '"' +
                    'style="position: absolute; top: 0px; right: -6px;">' +
                    '<div style="' + style + '">x</div>' +
                    '</md-button>');
            }
        }
    }
}