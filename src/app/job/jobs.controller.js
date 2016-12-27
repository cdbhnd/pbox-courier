(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobsController', jobsController);

    /** @ngInject */
    function jobsController($ionicPopup, jobService, pboxLoader) {

        var vm = this;

        /////////////////////////////////////

        (function activate() {
            loadJobs();
        }());

        /////////////////////////////////////

        function loadJobs() {
            pboxLoader.loaderOn();
            return jobService.getAll()
                .then(function(response) {
                    vm.jobs = response;
                    if (response.length == 0) {
                        $ionicPopup.alert({
                            title: 'There is no available jobs in your area!',
                            template: '',
                            buttons: [{
                                text: 'OK',
                                type: 'button-energized'
                            }]
                        });
                    }
                })
                .finally(function() {
                    pboxLoader.loaderOff();
                });
        }

    }
})();