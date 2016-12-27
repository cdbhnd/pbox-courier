(function() {
    'use strict';

    angular
        .module('pbox.courier.auth')
        .controller('authController', authController);

    /** @ngInject */
    function authController($state, $ionicPopup, pboxLoader, authService) {

        var vm = this;

        vm.user = {
            username: '',
            password: ''
        }

        vm.loginUser = loginUser;

        /////////////////////////////////////

        (function activate() {}());

        /////////////////////////////////////

        function loginUser() {
            if (vm.user.username && vm.user.password) {
                pboxLoader.loaderOn();
                return authService.login(vm.user.username, vm.user.password)
                    .then(function(response) {
                        $state.go('jobs');
                    })
                    .catch(function(e) {
                        if (e.status === 401) {
                            $ionicPopup.alert({
                                title: 'Wrong username or password!',
                                template: '',
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-energized'
                                }]
                            });
                        }
                        if (e.status === 500) {
                            $ionicPopup.alert({
                                title: 'Something went wrong, please try leater!',
                                template: '',
                                buttons: [{
                                    text: 'OK',
                                    type: 'button-energized'
                                }]
                            });
                        }
                    })
                    .finally(function() {
                        pboxLoader.loaderOff();
                    });
            } else {
                if (!vm.user.username || vm.user.password) {
                    $ionicPopup.alert({
                        title: 'Username or password is missing!',
                        template: '',
                        buttons: [{
                            text: 'OK',
                            type: 'button-energized'
                        }]
                    });
                }
            }
        }

    }
})();