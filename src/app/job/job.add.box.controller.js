(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('jobAddBoxController', jobAddBoxController);

    /**@ngInject */
    function jobAddBoxController($q, $stateParams, $state, $cordovaBarcodeScanner, jobService, jobConfig, pboxLoader, pboxPopup) {
        var vm = this;

        //variables and properties
        vm.job = null;
        vm.boxId = null;
        vm.isCordovaApp = null;

        //public methods
        vm.assignBox = assignBox;
        vm.scanBarcode = scanBarcode;

        //////////////////////////////////////////////////////////
        /**Activate */
        (function () {
            startLoading()
                .then(loadJob)
                .then(checkPlatform)
                .finally(stopLoading);
        }());

        //////////////////////////////////////////////////////////

        function startLoading() {
            return pboxLoader.loaderOn();
        }

        function loadJob() {
            return jobService.getJob($stateParams.jobId)
                .then(function (response) {
                    if (!response) {
                        riseAlertPopup(jobConfig.messages.jobNotFound);
                    }
                    vm.job = response;
                })
                .catch(function () {
                    riseAlertPopup(jobConfig.messages.somethingWentWrong);
                });
        }

        function checkPlatform() {
            vm.isCordovaApp = document.URL.indexOf('http://') === -1 &&
                document.URL.indexOf('https://') === -1;
        }

        function stopLoading() {
            return pboxLoader.loaderOff();
        }

        function assignBox() {
            startLoading()
                .then(updateJob)
                .catch(function () {
                    riseAlertPopup(jobConfig.messages.failedOperation);
                })
                .finally(stopLoading);
        }

        function updateJob() {
            return jobService.update($stateParams.jobId, {
                    status: jobConfig.jobStatuses.inProgress,
                    box: vm.boxId
                })
                .then(function (response) {
                    if (response.status !== jobConfig.jobStatuses.inProgress) {
                        riseAlertPopup(jobConfig.messages.boxNotAssigned);
                    } else {
                        riseAlertPopup(jobConfig.messages.boxAssigned);
                    }
                    changeState(jobConfig.states.JobDetails, { jobId: vm.job.id });
                })
        }

        vm.onSuccess = function (data) {
            console.log(data);
            vm.boxId = data;
        };
        vm.onError = function (error) {
            console.log(error);
        };
        vm.onVideoError = function (error) {
            console.log(error);
        };

        function scanBarcode() {
            $cordovaBarcodeScanner.scan()
                .then(function (imageData) {
                    vm.boxId = imageData.text;
                }, function (error) {
                    console.log('An error happened -> ' + error);
                })
                .then(assignBox);
        }

        function riseAlertPopup(msg) {
            return pboxPopup.alert(msg);
        }

        function changeState(name, param) {
            return $state.go(name, param);
        }
    }
})(window.angular);
