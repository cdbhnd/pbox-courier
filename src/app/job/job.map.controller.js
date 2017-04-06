(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('jobMapController', jobMapController);

    /**@ngInject */
    function jobMapController($q, $stateParams, jobService, geolocationService, pboxLoader, pboxPopup, mapConfig, jobConfig) {
        var vm = this;

        //variables and properties
        vm.job = null;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.markerColors = ['#33CBCC', '#3F5877'];

        /////////////////////////////////////
        /**Activate */
        (function () {
            startLoading()
                .then(getCurrentLocation)
                .then(loadJob)
                .finally(stopLoading);
        }());
        /////////////////////////////////////

        function startLoading() {
            return pboxLoader.loaderOn();
        }

        function getCurrentLocation() {
            return geolocationService.currentLocation()
                .then(function (coords) {
                    vm.mapOptions.mapCenter = coords;
                });
        }

        function loadJob() {
            return jobService.getJob($stateParams.jobId)
                .then(function (response) {
                    vm.job = response;
                    vm.mapMarkers.push(vm.job.pickup);
                    if (!!vm.job.destination && vm.job.destination.valid()) {
                        vm.mapMarkers.push(vm.job.destination);
                    }
                })
                .catch(function () {
                    pboxPopup.alert(jobConfig.messages.jobNotFound);
                });
        }

        function stopLoading() {
            return pboxLoader.loaderOff();
        }
    }
})(window.angular);
