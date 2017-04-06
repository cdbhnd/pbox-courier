(function (angular) {
    angular
        .module('pbox.courier.nav')
        .controller('sideMenuController', sideMenuController);

    /**@ngInject */
    function sideMenuController($q, $rootScope, $state, authService) {
        var vm = this;

        //variables and properties
        vm.currentState = null;

        //public methods
        vm.redirectToState = redirectToState;
        vm.logout = logout;

        /////////////////////////////////////
        /**Activate */
        (function () {
            subscribeOnCurrentStateChnage();
        }());

        /////////////////////////////////////

        function subscribeOnCurrentStateChnage() {
            return $rootScope.$watch('currentState', function () {
                vm.currentState = $rootScope.currentState;
            });
        }

        function redirectToState(name, params) {
            return $state.go(name, params);
        }

        function logout() {
            return authService.logout()
                .then(redirectToState('login'));
        }
    }
})(window.angular);
