(function() {
    'use strict';

    angular
        .module('pbox.courier')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('hello', {
                    url: '/',
                    templateUrl: 'app/navigation/hello.html',
                    data: {
                        disableBack: true
                    }
                })

            $urlRouterProvider.otherwise('/');
        }]);
})();