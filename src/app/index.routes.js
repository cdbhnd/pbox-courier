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
                        disableMenu: true,
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
                .state('my-jobs', {
                    url: '/my-jobs',
                    templateUrl: 'app/job/my.jobs.html',
                    controller: 'myJobsController',
                    controllerAs: 'vm'
                })
                .state('job-details', {
                    url: '/jobs/{jobId}',
                    templateUrl: 'app/job/job.details.html'
                })

            $urlRouterProvider.otherwise('/');
        }]);
})();