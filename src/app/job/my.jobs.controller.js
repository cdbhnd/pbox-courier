(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('myJobsController', myJobsController);

    /** @ngInject */
    function myJobsController($scope, $q, $timeout, $localStorage, $state, jobService, pboxLoader, pboxPopup, UserModel, authService) {

        var vm = this;
        var user;

        vm.jobs = [];
        vm.openJob = openJob;
        vm.refreshList = refreshList;

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(loadUser)
                .then(loadJobs)
                .finally(stopLoading);
        }());

        ////////////////////////////////////

        function openJob(job) {
            $state.go('job-details', {
                jobId: job.id
            });
        }

        function refreshList() {
            loadJobs()
                .then(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function loadUser() {
            return authService.currentUser()
                .then(function(response) {
                    user = new UserModel(response);
                });
        }

        function loadJobs() {
            return jobService.get({
                    courierId: user.id
                })
                .then(function(response) {
                    vm.jobs = response;
                    if (response.length == 0) {
                        pboxPopup.alert('No jobs avilable!');
                    }
                });
        }

        function startLoading() {
            return $q.when(function() {
                pboxLoader.loaderOn();
            }());
        }

        function stopLoading() {
            return $q.when(function() {
                pboxLoader.loaderOff();
            }());
        }

    }
})();