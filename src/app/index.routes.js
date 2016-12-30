(function() {
    'use strict';

    angular
        .module('pbox.courier')
        .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

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
                    cache: false,
                    data: {
                        disableBack: true
                    }
                })
                .state('my-jobs', {
                    url: '/my-jobs',
                    templateUrl: 'app/job/my.jobs.html',
                    controller: 'myJobsController',
                    controllerAs: 'vm',
                    cache: false
                })
                .state('job-details', {
                    url: '/jobs/{jobId}',
                    templateUrl: 'app/job/job.details.html',
                    controller: 'jobDetailsController',
                    controllerAs: 'vm'
                });

            $urlRouterProvider.otherwise('/');
        }]);
})();