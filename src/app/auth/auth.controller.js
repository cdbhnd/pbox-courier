(function (angular) {
    angular
        .module('pbox.courier.auth')
        .controller('authController', authController);

    /**@ngInject */
    function authController($state, $q, authService, authConfig, UserModel, pboxLoader, pboxPopup) {
        var vm = this;

        //variables and properties
        vm.user = new UserModel();

        //public methods
        vm.loginUser = loginUser;

        /////////////////////////////////////
        /**Activate */
        (function () {
            checkIfUserAlreadyLoggedIn();
        }());

        /////////////////////////////////////

        function checkIfUserAlreadyLoggedIn() {
            return authService.currentUser()
                .then(function (user) {
                    if (!!user) {
                        redirectToState(authConfig.states.jobs);
                    }
                });
        }

        function loginUser() {
            if (!vm.user.username || !vm.user.password) {
                riseAlertPopup(authConfig.errorMessages.missingCredentials);
                return;
            }
            startLoading()
                .then(loginAndRedirect)
                .then(stopLoading)
                .catch(handleError);
        }

        function startLoading() {
            return pboxLoader.loaderOn();
        }

        function loginAndRedirect() {
            return authService.login(vm.user.username, vm.user.password)
                .then(function () {
                    redirectToState(authConfig.states.jobs);
                });
        }

        function redirectToState(state) {
            return $state.go(state);
        }

        function stopLoading() {
            return pboxLoader.loaderOff();
        }

        function handleError(error) {
            stopLoading()
                .then(function () {
                    if (error.status === 401) {
                        riseAlertPopup(authConfig.errorMessages.wrongCredentials);
                    } else {
                        riseAlertPopup(authConfig.errorMessages.genericError);
                    }
                });
        }

        function riseAlertPopup(msg) {
            return pboxPopup.alert(msg);
        }
    }
})(window.angular);
