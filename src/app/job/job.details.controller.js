(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobDetailsController', jobDetailsController);

    /** @ngInject */
    function jobDetailsController($scope, $q, $timeout, $ionicPopup, jobService, pboxLoader, pboxPopup, $stateParams, $state) {

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
                        pboxPopup.alert('Job could not be found !');
                    }
                })
                .catch(function(err) {
                    pboxPopup.alert('Job could not be found !');
                });
        }

        function cancelJob() {
            pboxPopup.confirm('Are you sure you want to cancel this job?')
                .then(function(res) {
                    if (res) {
                        jobService.update($stateParams.jobId, {
                                "status": "CANCELED"
                            })
                            .then(function(response) {
                                pboxPopup.alert('Job canceled!');
                                vm.job = response;
                                $state.go('my-jobs');
                            })
                            .catch(function(err) {
                                pboxPopup.alert('Operation failed!');
                            });
                    }
                });
        }

        function unassignFromJob() {
            startLoading();
            return pboxPopup.confirm('Are you sure you want to unassing from this job?')
                .then(function(response) {
                    if (response) {
                        return jobService.unassign(vm.job);    
                    }
                })
                .then(function(response) {
                    if (response) {
                        pboxPopup.alert('You have unassinged from job !');
                        $state.go('my-jobs');
                    }
                })
                .catch(function(err) {
                    pboxPopup.alert('Operation failed!');
                })
                .finally(stopLoading);
        }

        function completeJob() {
            jobService.update($stateParams.jobId, {
                        "status": "COMPLETED"
                    })
                    .then(function (response) {
                        pboxPopup.alert(' Job set to completed !');
                        $state.go('my-jobs');
                    })
                    .catch(function (err) {
                        pboxPopup.alert('Operation failed!');
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