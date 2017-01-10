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
                    cache: true,
                    title: 'Available Jobs',
                    data: {
                        disableBack: true
                    }
                })
                .state('my-jobs', {
                    url: '/my-jobs',
                    templateUrl: 'app/job/my.jobs.html',
                    controller: 'myJobsController',
                    controllerAs: 'vm',
                    cache: false,
                    title: 'My Jobs',
                    data: {
                        disableBack: true
                    }
                })
                .state('job-details', {
                    url: '/jobs/{jobId}',
                    templateUrl: 'app/job/job.details.html',
                    controller: 'jobDetailsController',
                    cache: false,
                    controllerAs: 'vm',
                    title: 'Job Details'
                })
                .state('job-map', {
                    url: '/jobs/map/{jobId}',
                    templateUrl: 'app/job/job.map.html',
                    controller: 'jobMapController',
                    cache: false,
                    controllerAs: 'vm',
                    title: 'Job Route'
                })
                .state('job-add-box',{
                    url: '/add/box/{jobId}',
                    templateUrl: 'app/job/job.add.box.html',
                    controller: 'jobAddBoxController',
                    cache: false,
                    controllerAs: 'vm',
                    title: 'Assign box to job'
                });

            $urlRouterProvider.otherwise('/');
        }]);
})();