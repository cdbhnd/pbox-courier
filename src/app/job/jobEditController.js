(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('jobEditController', jobEditController);

    /**@ngInject */
    function jobEditController($q, jobService, pboxLoader, pboxPopup, $stateParams, $state) {
        var vm = this;
        var invalidFields = '';

        //public methods
        vm.save = save;

        //variables and properties
        vm.sizeOptions = [{ name: 'small', value: 'S' }, { name: 'medium', value: 'M' }, { name: 'large', value: 'L' }];
        vm.job = null;
        vm.jobCountry = 'Serbia';
        vm.jobCity = 'Belgrade';
        vm.jobDestinationStreet = null;
        vm.jobHouseNumber = null;

        //////////////////////////////////////////////////////////
        //**Activate */
        (function () {
            startLoading()
                .then(loadJob)
                .finally(stopLoading);
        }());

        //////////////////////////////////////////////////////////

        function startLoading() {
            return $q.when(function () {
                pboxLoader.loaderOn();
            }());
        }

        function stopLoading() {
            return $q.when(function () {
                pboxLoader.loaderOff();
            }());
        }

        function loadJob() {
            return jobService.getJob($stateParams.jobId)
                .then(function (response) {
                    vm.job = response;
                    if (!response) {
                        pboxPopup.alert('Job could not be found !');
                    }
                })
                .catch(function () {
                    pboxPopup.alert('Job could not be found !');
                });
        }

        function save() {
            if (!validate()) {
                pboxPopup.alert('These fields are required: ' + invalidFields);
                return false;
            }
            vm.job.destination.address = vm.jobDestinationStreet +
                 ' ' + vm.jobHouseNumber +
                 ', ' + vm.jobCity +
                 ', ' + vm.jobCountry;

            startLoading();

            return jobService.update($stateParams.jobId, {
                destination: vm.job.destination,
                size: vm.job.size,
                receiverName: vm.job.receiverName,
                receiverPhone: vm.job.reciverPhone
            })
                .then(function () {
                    pboxPopup.alert('Details have been saved !');
                    $state.go('job-details', { jobId: vm.job.id });
                })
                .catch(function () {
                    pboxPopup.alert('Operation failed!');
                })
                .finally(stopLoading);
        }

        function validate() {
            invalidFields = '';

            if (!vm.job.size) {
                invalidFields = invalidFields + 'Box size';
            }
            if (!vm.jobCountry) {
                invalidFields = invalidFields + 'Country ';
            }
            if (!vm.jobCity) {
                invalidFields = invalidFields + 'City ';
            }
            if (!vm.jobDestinationStreet) {
                invalidFields = invalidFields + 'Street name ';
            }
            if (!vm.jobHouseNumber) {
                invalidFields = invalidFields + 'Street number ';
            }

            if (invalidFields.length > 0) {
                return false;
            }
            return true;
        }
    }
})(window.angular);
