(function (angular) {
    angular
        .module('pbox.courier.auth')
        .service('authService', authService);

    /**@ngInject */
    function authService($q, $rootScope, $localStorage, pboxApi, config, UserModel) {
        var service = this;

        //public methods
        service.init = init;
        service.register = register;
        service.login = login;
        service.logout = logout;
        service.currentUser = currentUser;

        //////////////////////////////////

        function init() {
            if (!!$localStorage.currentUser) {
                setCurrentUser($localStorage.currentUser);
            }
        }

        function register(user) {
            return pboxApi.http({
                    method: config.httpMethods.POST,
                    url: config.pboxAPI.USERS,
                    data: user
                })
                .then(function (data) {
                    return setCurrentUser(data);
                });
        }

        function login(username, password) {
            return pboxApi.http({
                    method: config.httpMethods.POST,
                    url: config.pboxAPI.TOKEN,
                    data: {
                        username: username,
                        password: password,
                        type: 3
                    }
                })
                .then(function (data) {
                    return setCurrentUser(data);
                });
        }

        function logout() {
            return $q.when(function () {
                delete $localStorage.currentUser;
                delete $localStorage.credentials;
                delete $rootScope.currentUser;
                return true;
            }());
        }

        function currentUser() {
            return $q.when(function () {
                if (!!$localStorage.currentUser) {
                    return $localStorage.currentUser;
                }
                return null;
            }());
        }

        function setCurrentUser(userData) {
            var userModel = new UserModel(userData);
            $localStorage.currentUser = userModel;
            $rootScope.currentUser = userModel;
            return userModel;
        }
    }
})(window.angular);
