(function (angular) {
    angular
		.module('pbox.courier.nav')
		.controller('sideMenuController', sideMenuController);

	/**@ngInject */
    function sideMenuController($q, $rootScope, $state, authService) {
        var vm = this;

        vm.currentState = null;

        vm.changeState = changeState;
        vm.logout = logout;

		//**Activate */
        (function () {
            subscribeOnCurrentStateChnage();
        }());

        function subscribeOnCurrentStateChnage() {
            return $rootScope.$watch('current_state', function () {
                vm.currentState = $rootScope.current_state;
            });
        }

        function changeState(name, params) {
            return $state.go(name, params);
        }

        function logout() {
            return authService.logout()
				.then(function () {
    $state.go('login');
});
        }
    }
})(window.angular);
