(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobMapController', jobMapController);

    /** @ngInject */
    function jobMapController($q, $stateParams, jobService, geolocationService, pboxLoader, pboxPopup, mapConfig) {

        var vm = this;

        vm.job = null;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];

        (function activate() {
            startLoading()
            	.then(getCurrentLocation)
                .then(loadJob)
                .finally(stopLoading);
        }());

        function getCurrentLocation() {
        	return geolocationService.currentLocation()
        		.then(function(coords) {
        			vm.mapOptions.center = coords;
        		});
        }

        function loadJob() {
            return jobService.getJob($stateParams.jobId)
                .then(function(response) {
                    vm.job = response;
                    vm.mapMarkers.push(vm.job.pickup);
                })
                .catch(function(err) {
                    pboxPopup.alert('Job could not be found !');
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
