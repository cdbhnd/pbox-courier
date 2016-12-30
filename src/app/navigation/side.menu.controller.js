(function() {
	'use strict';

	angular
		.module('pbox.courier.nav')
		.controller('sideMenuController', sideMenuController);

	/** @ngInject */
	function sideMenuController($q, $rootScope, $state) {

		var vm = this;

		vm.currentState = null;

		vm.changeState = changeState;

		(function activate() {
			subscribeOnCurrentStateChnage();
		}())

		function subscribeOnCurrentStateChnage() {
			return $rootScope.$watch('current_state', function() {
				vm.currentState = $rootScope.current_state;
			});
		}

		function changeState(name, params) {
			return $state.go(name, params);
		}
	}
})();