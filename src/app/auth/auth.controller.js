(function() {
    'use strict';

    angular
        .module('pbox.courier.auth')
        .controller('authController', authController);

    /** @ngInject */
    function authController($state, $localStorage, pboxLoader, pboxAlert, authService, UserModel) {

        var vm = this;

        vm.user = new UserModel();

        vm.loginUser = loginUser;

        /////////////////////////////////////

        (function activate() {
            tryRedirect();
        }());

        /////////////////////////////////////

        function loginUser() {
            if (vm.user.username && vm.user.password) {
                pboxLoader.loaderOn();
                login()
                    .then(function(response) {
                        $state.go('jobs');
                    })
                    .catch(function(e) {
                        if (e.status === 401) {
                            pboxAlert.alert('Wrong username or password!');
                        }
                        if (e.status === 500) {
                            pboxAlert.alert('Something went wrong, please try leater!');
                        }
                    })
                    .finally(function() {
                        pboxLoader.loaderOff();
                    });
            } else {
                if (!vm.user.username || !vm.user.password) {
                    pboxAlert.alert('Username or password is missing!');
                }
            }
        }

        ////////////////////////////////////////////////////

        function tryRedirect() {
            if ($localStorage.current_user) {
                $state.go('jobs');
            }
        }

        function login() {
            return authService.login(vm.user.username, vm.user.password)
        }
    }
})();