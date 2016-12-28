(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobsController', jobsController);

    /** @ngInject */
    function jobsController($scope, $q, $timeout, $ionicPopup, jobService, pboxLoader, pboxAlert) {

        var vm = this;

        vm.refreshList = refreshList;

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(loadJobs)
                .then(pollJobs)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function loadJobs() {
            return jobService.getAll()
                .then(function(response) {
                    vm.jobs = response;
                    if (response.length == 0) {
                        pboxAlert.alert('There is no available jobs in your area!');
                    }
                });
        }

        function pollJobs() {
            $timeout(function() {
                console.log('poll');
                loadJobs()
                    .then(pollJobs);
            }, 300000);
        }

        function startLoading() {
            return $q.when(function() {
                pboxLoader.loaderOn();
            });
        }

        function stopLoading() {
            return $q.when(function() {
                pboxLoader.loaderOff();
            });
        }

        function refreshList() {
            loadJobs()
                .then(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }
    }
})();