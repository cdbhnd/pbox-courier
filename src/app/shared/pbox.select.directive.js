(function () {
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
            
            link: function(scope, elements, attrs){
                
                scope.active = false;

                //functions
                scope.toggle = toggle;
                scope.selectValue = selectValue;
                
                function toggle() {
                    scope.active = !scope.active;
                }

                function selectValue(selectedValue) {
                    scope.active = false;
                    scope.modelValue = selectedValue;
                }
            }
        }
    }
})();