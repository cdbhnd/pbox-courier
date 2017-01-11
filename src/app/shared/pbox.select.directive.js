(function () {
    angular.module('pbox.courier')
        .directive('pboxSelect', pboxSelectDirective);

    function pboxSelectDirective() {
        return {
            templateUrl: 'app/shared/pbox.select.html',
            restrict: 'E',
            scope: { pbOptions: '=',
                     modelValue: '=ngModel'
                    },
            
            controller: function($scope, $element){

                //properties
                $scope.active = false;

                //functions
                $scope.activate = activate;
                
                function activate() {
                    $scope.active = true;
                }

                function deactivate(selectedValue) {
                    $scope.active = false;
                    modelValue = selectedValue;
                }
            }
        }
    }
})();