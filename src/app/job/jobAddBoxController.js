(function () {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobAddBoxController', jobAddBoxController);

    /** @ngInject */
    function jobAddBoxController($q, jobService, pboxLoader, pboxPopup, $stateParams, $state) {

        var vm = this;

        //public methods
        vm.assaginBox = assaginBox;

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
                    if (!response) {
                        pboxPopup.alert('Job could not be found !');
                    }
                })
                .catch(function (err) {
                    pboxPopup.alert('Job could not be found !');
                });
        }

        function assaginBox() {
            startLoading();
            jobService.update($stateParams.jobId, {
                "status": "IN_PROGRESS",
                "box": vm.boxId
            })
                .then(function (response) {
                    if(response.status != 'IN_PROGRESS') {
                        pboxPopup.alert('Box was not assigned to the job!');
                    }else {
                        pboxPopup.alert('Box assigned to the job!');
                    }
                    $state.go('my-jobs');
                })
                .catch(function (err) {
                    pboxPopup.alert('Operation failed!');
                })
                .finally(stopLoading);
        }

    }
})();
