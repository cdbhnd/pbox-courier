(function (angular) {
    angular.module('pbox.courier')
        .directive('pboxSelect', pboxSelectDirective);

    function pboxSelectDirective() {
        return {
            templateUrl: 'app/shared/pbox.select.html',
            restrict: 'E',
            scope: {
                pbOptions: '=',
                modelValue: '=ngModel',
                pbLabel: '=pbLabel'
            },
            replace: true,

            link: function (scope) {
                //variables and functions
                scope.active = false;

                //public methods
                scope.toggle = toggle;
                scope.selectValue = selectValue;

                ///////////////////////////////////////////

                function toggle() {
                    scope.active = !scope.active;
                }

                function selectValue(selectedValue) {
                    scope.active = false;
                    scope.modelValue = selectedValue;
                }
            }
        };
    }
})(window.angular);
