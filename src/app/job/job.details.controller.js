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
            return jobService.get($stateParams.jobId)
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
                            })
                            .catch(function(err) {
                                pboxPopup.alert('Job could not be canceled!');
                            });
                    }
                });
        }

        function unassignFromJob() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'PBox',
                template: 'Are you sure you want to unassing from this job?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    jobService.updateJob($stateParams.jobId, {
                            "courierId": ""
                        })
                        .then(function(response) {
                            pboxAlert.alert(' You have unassinged from job !');
                            $state.go('my-jobs');
                        })
                        .catch(function(err) {
                            pboxAlert.alert('Operation failed!');
                        });
                } else {

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