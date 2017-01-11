(function () {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobEditController', jobEditController);

    /** @ngInject */
    function jobEditController($q, jobService, pboxLoader, pboxPopup, $stateParams, $state) {

        var vm = this;

        //public methods
        vm.save = save;

        //variables and properties
        vm.sizeOptions = [{name: 'small', value: 'S'}, {name: 'medium', value: 'M'}, {name: 'large', value: 'L'}];
        vm.job = null;

        //////////////////////////////////////////////////////////

        (function activate() {
            startLoading()
                .then(loadJob)
                .finally(stopLoading);
        }());


        //////////////////////////////////////////////////////////
        
        function startLoading() {
            return $q.when(function () {
                pboxLoader.loaderOn();
            } ());
        }

        function stopLoading() {
            return $q.when(function () {
                pboxLoader.loaderOff();
            } ());
        }

        function loadJob() {
            return jobService.getJob($stateParams.jobId)
                .then(function (response) {
                    vm.job = response;
                    vm.job.destination.country = 'Serbia';
                    vm.job.destination.city = 'Belgrade';
                    if (!response) {
                        pboxPopup.alert('Job could not be found !');
                    }
                })
                .catch(function (err) {
                    pboxPopup.alert('Job could not be found !');
                });
        }

        function save() {
                startLoading();
                jobService.update($stateParams.jobId, {
                    "destination": vm.job.destination
                })
                .then(function (response) {
                    pboxPopup.alert('Details have been saved !');        
                    $state.go('job-details', { jobId: vm.job.id });
                })
                .catch(function (err) {
                    pboxPopup.alert('Operation failed!');
                })
                .finally(stopLoading);
        }

    }
})();
