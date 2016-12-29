(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobsController', jobsController);

    /** @ngInject */
    function jobsController($scope, $q, $timeout, $localStorage, $state, jobService, pboxLoader, pboxPopup, UserModel) {

        var vm = this;

        var user = new UserModel($localStorage.current_user);
        vm.jobs = [];
        vm.myJobs = [];

        vm.refreshList = refreshList;
        vm.selectJob = selectJob;

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(loadJobs)
                .then(pollJobs)
                .then(findMyJobs)
                .finally(stopLoading);
            console.dir(vm);
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
                        acceptJob(job.id, user.id);
                    } else {
                        console.log('no');
                    }
                });
        }

        ////////////////////////////////////

        function loadJobs() {
            return jobService.getAll()
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

        function acceptJob(jobId, courierId) {
            return jobService.accept(jobId, courierId)
                .then(function(response) {
                    if (response) {
                        $state.go('my-jobs');
                    }
                });
        }

        function findMyJobs() {
            for (var i = 0; i < vm.jobs.length; i++) {
                if (vm.jobs[i].courierId == user.id) {
                    vm.myJobs.push(vm.jobs[i]);
                }
            }
        }

        function startLoading() {
            return $q.when(function() {
                pboxLoader.loaderOn();
            });
        }

        function stopLoading() {
            return $q.when(function() {
                pboxLoader.loaderOff();
            });
        }

    }
})();