(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobDetailsController', jobDetailsController);

    /** @ngInject */
    function jobDetailsController($scope, $q, $timeout, $ionicPopup, jobService, pboxLoader, pboxAlert, $stateParams, $state) {

        var vm = this;

        // public methods
        vm.cancelJob = cancelJob;
        vm.unassignFromJob = unassignFromJob;
        vm.completeJob = completeJob;

        //variables and properties
        vm.job = null;

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(loadJob)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function loadJob() {
            return jobService.getJob($stateParams.jobId)
                .then(function(response) {
                    vm.job = response;
                    if (!response) {
                        pboxAlert.alert('Job could not be found !');
                    }
                })
                .catch(function(err){
                    pboxAlert.alert('Job could not be found !');
                });
        }

        function cancelJob() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'PBox',
                template: 'Are you sure you want to cancel this job?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    jobService.updateJob($stateParams.jobId, {
                        "status": "CANCELED"
                    })
                    .then(function (response) {
                        pboxAlert.alert('Job canceled!');
                        vm.job = response;
                    })
                    .catch(function (err) {
                        pboxAlert.alert('Operation failed!');
                    });
                } else {
                   
                }
            });
            
        }

        function unassignFromJob() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'PBox',
                template: 'Are you sure you want to unassing from this job?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    jobService.updateJob($stateParams.jobId, {
                        "courierId": ""
                    })
                    .then(function (response) {
                        pboxAlert.alert(' You have unassinged from job !');
                        $state.go('my-jobs');
                    })
                    .catch(function (err) {
                        pboxAlert.alert('Operation failed!');
                    });
                } else {
                   
                }
            });
        }

        function completeJob() {
            jobService.updateJob($stateParams.jobId, {
                        "status": "COMPLETED"
                    })
                    .then(function (response) {
                        pboxAlert.alert(' Job set to completed !');
                        $state.go('my-jobs');
                    })
                    .catch(function (err) {
                        pboxAlert.alert('Operation failed!');
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