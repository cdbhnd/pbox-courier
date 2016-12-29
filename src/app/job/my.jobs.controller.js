(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('myJobsController', myJobsController);

    /** @ngInject */
    function myJobsController($scope, $q, $timeout, $localStorage, $state, jobService, pboxLoader, pboxPopup, UserModel, authService) {

        var vm = this;
        var user = new UserModel(authService.currentUser());

        vm.jobs = [];
        vm.openJob = openJob;

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(loadJobs)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        (function activate() {}());

        ////////////////////////////////////

        function openJob(job) {
            $state.go('job-details', {
                jobId: job.id
            });
            console.log('job', job);
        }

        ///////////////////////////////////

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