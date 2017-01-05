(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobsController', jobsController);

    /** @ngInject */
    function jobsController($scope, $q, $timeout, $localStorage, $state, jobService, pboxLoader, pboxPopup, UserModel, authService) {

        var vm = this;
        var user = new UserModel(authService.currentUser());

        vm.jobs = [];
        vm.listCanSwipe = true;
        vm.jobActions = [{
            onClick: locateJob,
            button: 'button-energized',
            icon: 'ion-location'
        }, {
            onClick: acceptJob,
            button: 'button-main',
            icon: 'ion-checkmark-round'
        }];

        vm.refreshList = refreshList;
        vm.selectJob = selectJob;
        vm.acceptJob = acceptJob;
        vm.locateJob = locateJob;

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(loadUser)
                .then(loadJobs)
                .then(pollJobs)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function refreshList() {
            loadJobs()
                .then(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function selectJob(job) {
            pboxPopup.confirm('Would you accept job?')
                .then(function(response) {
                    if (response) {
                        acceptJob(job);
                    }
                });
        }

        ////////////////////////////////////

        function loadUser() {
            return authService.currentUser()
                .then(function(response) {
                    user = new UserModel(response);
                });
        }

        function loadJobs() {
            return jobService.get({
                    status: 'PENDING'
                })
                .then(function(response) {
                    vm.jobs = response;
                    if (response.length == 0) {
                        pboxPopup.alert('There is no available jobs in your area!');
                    }
                });
        }

        function pollJobs() {
            $timeout(function() {
                loadJobs()
                    .then(pollJobs);
            }, 300000);
        }

        function acceptJob(job) {
            var jobId = job.id;
            var courierId = user.id;
            startLoading();
            return jobService.accept(jobId, courierId)
                .then(stopLoading)
                .then(function(response) {
                    $state.go('my-jobs');
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

        function locateJob(job) {
            $state.go('job-map', { jobId: job.id });
        }
    }
})();