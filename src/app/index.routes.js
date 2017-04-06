(function (angular) {
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
                    templateUrl: 'app/job/job.html',
                    controller: 'jobController',
                    controllerAs: 'vm',
                    cache: true,
                    title: 'Available Jobs',
                    data: {
                        disableBack: true,
                        authRequired: true
                    }
                })
                .state('my-jobs', {
                    url: '/my-jobs',
                    templateUrl: 'app/job/job.my.html',
                    controller: 'jobMyController',
                    controllerAs: 'vm',
                    cache: false,
                    title: 'My Jobs',
                    data: {
                        disableBack: true,
                        authRequired: true
                    }
                })
                .state('job-details', {
                    url: '/jobs/{jobId}',
                    templateUrl: 'app/job/job.details.html',
                    controller: 'jobDetailsController',
                    cache: false,
                    controllerAs: 'vm',
                    title: 'Job Details',
                    data: {
                        authRequired: true
                    }
                })
                .state('job-map', {
                    url: '/jobs/map/{jobId}',
                    templateUrl: 'app/job/job.map.html',
                    controller: 'jobMapController',
                    cache: false,
                    controllerAs: 'vm',
                    title: 'Job Route',
                    data: {
                        authRequired: true
                    }
                })
                .state('job-add-box', {
                    url: '/add/box/{jobId}',
                    templateUrl: 'app/job/job.add.box.html',
                    controller: 'jobAddBoxController',
                    cache: false,
                    controllerAs: 'vm',
                    title: 'Assign box to job',
                    data: {
                        authRequired: true
                    }
                })
                .state('job-edit', {
                    url: '/job/edit/{jobId}',
                    templateUrl: 'app/job/job.edit.html',
                    controller: 'jobEditController',
                    cache: false,
                    controllerAs: 'vm',
                    title: 'Edit ...',
                    data: {
                        authRequired: true
                    }
                });

            $urlRouterProvider.otherwise('/');
        }]);
})(window.angular);
