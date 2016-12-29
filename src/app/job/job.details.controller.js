(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobDetailsController', jobDetailsController);

    /** @ngInject */
    function jobDetailsController($scope, $q, $timeout, $ionicPopup, jobService, pboxLoader, pboxPopup, $stateParams) {

        var vm = this;

        // public methods
        vm.cancelJob = cancelJob;

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