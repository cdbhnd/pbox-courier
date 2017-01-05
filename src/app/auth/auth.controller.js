(function() {
    'use strict';

    angular
        .module('pbox.courier.auth')
        .controller('authController', authController);

    /** @ngInject */
    function authController($state, $q, pboxLoader, pboxPopup, authService, UserModel) {

        var vm = this;

        vm.user = new UserModel();

        vm.loginUser = loginUser;

        /////////////////////////////////////

        (function activate() {
            checkIfUserAlreadyLogedIn();
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
                            pboxPopup.alert('Wrong username or password!');
                        }
                        if (e.status === 500) {
                            pboxPopup.alert('Something went wrong, please try leater!');
                        }
                    })
                    .finally(function() {
                        pboxLoader.loaderOff();
                    });
            } else {
                if (!vm.user.username || !vm.user.password) {
                    pboxPopup.alert('Username or password is missing!');
                }
            }
        }

        ////////////////////////////////////////////////////

        function checkIfUserAlreadyLogedIn() {
            return $q.when(function() {
                if (!!authService.currentUser()) {
                    $state.go('jobs');
                    return false;
                }
                return true;    
            }());
        }

        function login() {
            return authService.login(vm.user.username, vm.user.password)
        }
    }
})();