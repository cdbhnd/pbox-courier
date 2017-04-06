(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('jobEditController', jobEditController);

    /**@ngInject */
    function jobEditController($q, $stateParams, $state, jobConfig, jobService, pboxLoader, pboxPopup) {
        var vm = this;

        //variables and properties
        var invalidFields = '';
        vm.sizeOptions = [{ name: 'small', value: 'S' }, { name: 'medium', value: 'M' }, { name: 'large', value: 'L' }];
        vm.job = null;
        vm.jobCountry = 'Serbia';
        vm.jobCity = 'Belgrade';
        vm.jobDestinationStreet = null;
        vm.jobHouseNumber = null;

        //public methods
        vm.save = saveChanges;

        //////////////////////////////////////////////////////////
        //**Activate */
        (function () {
            startLoading()
                .then(loadJob)
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
                        return;
                    }
                    vm.job = response;
                })
                .catch(function () {
                    riseAlertPopup(jobConfig.messages.jobNotFound);
                });
        }

        function stopLoading() {
            return pboxLoader.loaderOff();
        }


        function saveChanges() {
            if (!validate()) {
                riseAlertPopup(jobConfig.fields.errorMsg + invalidFields);
                return;
            }
            startLoading()
                .then(updateJob)
                .catch(function () {
                    riseAlertPopup(jobConfig.messages.failedOperation);
                })
                .finally(stopLoading);
        }

        function updateJob() {
            vm.job.destination.address = vm.jobDestinationStreet +
                ' ' + vm.jobHouseNumber +
                ', ' + vm.jobCity +
                ', ' + vm.jobCountry;

            return jobService.update($stateParams.jobId, {
                    destination: vm.job.destination,
                    size: vm.job.size,
                    receiverName: vm.job.receiverName,
                    receiverPhone: vm.job.reciverPhone
                })
                .then(riseAlertPopup(jobConfig.fields.savedMsg))
                .then(changeState(jobConfig.states.jobDetails, { jobId: vm.job.id }));
        }

        function validate() {
            invalidFields = '';

            if (!vm.job.size) {
                invalidFields = invalidFields + jobConfig.fields.boxSize;
            }
            if (!vm.jobCountry) {
                invalidFields = invalidFields + jobConfig.fields.country;
            }
            if (!vm.jobCity) {
                invalidFields = invalidFields + jobConfig.fields.city;
            }
            if (!vm.jobDestinationStreet) {
                invalidFields = invalidFields + jobConfig.fields.streetName;
            }
            if (!vm.jobHouseNumber) {
                invalidFields = invalidFields + jobConfig.fields.streetNumber;
            }

            if (invalidFields.length > 0) {
                return false;
            }
            return true;
        }

        function riseAlertPopup(msg) {
            return pboxPopup.alert(msg);
        }

        function changeState(name, param) {
            return $state.go(name, param);
        }
    }
})(window.angular);
