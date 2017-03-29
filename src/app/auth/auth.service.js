(function () {
    'use strict';

    angular
        .module('pbox.courier.auth')
        .service('authService', authService);

    /** @ngInject */
    function authService($q, $rootScope, pboxApi, config, $localStorage, UserModel) {

        var service = this;

        service.init = init;
        service.register = register;
        service.login = login;
        service.logout = logout;
        service.currentUser = currentUser;

        //////////////////////////////////

        function init() {
            if (!!$localStorage.current_user) {
                setCurrentUser($localStorage.current_user);
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

        function currentUser() {
            return $q.when(function () {
                if (!!$localStorage.current_user) {
                    return $localStorage.current_user;
                }
                return null;
            }());
        }

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function setCurrentUser(userData) {
            var userModel = new UserModel(userData);
            $localStorage.current_user = userModel;
            $rootScope.current_user = userModel;
            return userModel;
        }

        function logout() {
            return $q.when(function () {
                delete $localStorage.current_user;
                delete $localStorage.credentials;
                delete $rootScope.current_user;
                return true;
            }());
        }
    }
})();
