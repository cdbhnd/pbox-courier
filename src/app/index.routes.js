(function() {
    'use strict';

    angular
        .module('pbox')
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