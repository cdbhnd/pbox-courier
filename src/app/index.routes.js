(function () {
    'use strict';

    angular
        .module('pbox.courier')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('login', {
                    url: '/',
                    templateUrl: 'app/auth/auth.login.html',
                    data: {
                        disableNav: true,
                        disableBack: true
                    }
                })
                .state('jobs', {
                    url: '/jobs',
                    templateUrl: 'app/job/jobs.html',
                    controller: 'jobsController',
                    controllerAs: 'vm',
                    data: {
                        disableBack: true
                    }
                })
                .state('jobDetails', {
                    url: '/jobs/{jobId}',
                    templateUrl: 'app/job/job.details.html',
                    controller: 'jobDetailsController',
                    controllerAs: 'vm'
                })

            $urlRouterProvider.otherwise('/');
        }]);
})();