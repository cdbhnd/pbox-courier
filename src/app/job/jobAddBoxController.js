(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobAddBoxController', jobAddBoxController);

    /** @ngInject */
    function jobAddBoxController($q, jobService, pboxLoader, pboxPopup, $stateParams, $state) {

        var vm = this;

        //public methods
        vm.assaginBox = assaginBox;
        vm.scanBox = scanBox;

        //variables and properties
        vm.job = null;
        vm.boxId = null;

        //////////////////////////////////////////////////////////

        (function activate() {
            startLoading()
                .then(loadJob)
                .finally(stopLoading);
        }());


        //////////////////////////////////////////////////////////

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

        function assaginBox() {
            startLoading();
            jobService.update($stateParams.jobId, {
                    "status": "IN_PROGRESS",
                    "box": vm.boxId
                })
                .then(function(response) {
                    if (response.status != 'IN_PROGRESS') {
                        pboxPopup.alert('Box was not assigned to the job!');
                    } else {
                        pboxPopup.alert('Box assigned to the job!');
                    }
                    $state.go('job-details', { jobId: vm.job.id });
                })
                .catch(function(err) {
                    pboxPopup.alert('Operation failed!');
                })
                .finally(stopLoading);
        }

        function scanBox() {
            console.log("mile");
            barcodeScanner.scan().then(function(result) {
                if (result.canceled) {
                    return;
                }
                // text from qr code or barcode is contained in result.text
            }, function(err) {
                alert(err);
            });
        }

        vm.onSuccess = function(data) {
            console.log(data);
            vm.boxId = data;
        };
        vm.onError = function(error) {
            console.log(error);
        };
        vm.onVideoError = function(error) {
            console.log(error);
        };

    }
})();