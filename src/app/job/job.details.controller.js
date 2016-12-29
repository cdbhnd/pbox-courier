(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobDetailsController', jobDetailsController);

    /** @ngInject */
    function jobDetailsController($scope, $q, $timeout, $ionicPopup, jobService, pboxLoader, pboxAlert, $stateParams) {

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
                        pboxAlert.alert('Job could not be found !');
                    }
                })
                .catch(function(err) {
                    pboxAlert.alert('Job could not be found !');
                });
        }

        function cancelJob() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'PBox',
                template: 'Are you sure you want to cancel this job?'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    jobService.update($stateParams.jobId, {
                            "status": "CANCELED"
                        })
                        .then(function(response) {
                            pboxAlert.alert('Job canceled!');
                            vm.job = response;
                        })
                        .catch(function(err) {
                            pboxAlert.alert('Job could not be canceled!');
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