(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobAddBoxController', jobAddBoxController);

    /** @ngInject */
    function jobAddBoxController($q, jobService, pboxLoader, pboxPopup, $stateParams, $state, $cordovaBarcodeScanner) {

        var vm = this;

        //public methods
        vm.assignBox = assignBox;
        vm.scanBarcode = scanBarcode;

        //variables and properties
        vm.job = null;
        vm.boxId = null;
        vm.isCordovaApp = null;

        //////////////////////////////////////////////////////////

        (function activate() {
            startLoading()
                .then(loadJob)
                .finally(stopLoading);
            console.dir('cordova', vm.isCordovaApp);
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

        function checkPlatform() {
            vm.isCordovaApp = document.URL.indexOf('http://') === -1 &&
                document.URL.indexOf('https://') === -1;
        }

        function assignBox() {
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

        function scanBarcode() {
            $cordovaBarcodeScanner.scan()
                .then(function(imageData) {
                    vm.boxId = imageData.text;
                }, function(error) {
                    console.log("An error happened -> " + error);
                })
                .then(assignBox);
        };
    }
})();