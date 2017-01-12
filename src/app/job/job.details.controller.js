(function() {
    'use strict';

    angular
        .module('pbox.courier.job')
        .controller('jobDetailsController', jobDetailsController);

    /** @ngInject */
    function jobDetailsController($scope, $q, $timeout, $ionicPopup, jobService, pboxLoader, pboxPopup, $stateParams, $state, mapConfig, geolocationService, $ionicActionSheet) {

        var vm = this;

        // public methods
        vm.cancelJob = cancelJob;
        vm.unassignFromJob = unassignFromJob;
        vm.completeJob = completeJob;
        vm.openActions = openActions;
        vm.actionsClose = null;
        vm.showOnMap = showOnMap;
        vm.markerColors = ['#33CBCC', '#3F5877'];

        //variables and properties
        vm.job = null;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.actionSheetConfig = {
            buttons: [
                { text: 'Unassign', callback: unassignFromJob },
                { text: 'Edit', callback: editJob },
                { text: 'Add Box', callback: addBoxToJob },
                { text: 'Complete', callback: completeJob }
            ],
            destructiveText: 'Cancel',
            destructiveButtonClicked: cancelJob,
            cancelText: 'Close',
            buttonClicked: onActionClicked
        };

        /////////////////////////////////////

        (function activate() {
            startLoading()
                .then(getCurrentLocation)
                .then(loadMapOptions)
                .then(loadJob)
                .then(loadMapMarkers)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function getCurrentLocation() {
            return geolocationService.currentLocation()
                .then(function(coords) {
                    vm.mapOptions.mapCenter = coords;
                    return true;
                });
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

        function loadMapMarkers() {
            return $q.when(function() {
                vm.mapMarkers.push(vm.job.pickup);
                if (vm.job.destination.latitude && vm.job.destination.longitude) {
                    vm.mapMarkers.push(vm.job.destination);
                }
            }());
        }

        function loadMapOptions() {
            return $q.when(function() {
                vm.mapOptions.disableDefaultUI = true;
                vm.mapOptions.zoomControl = false;
                vm.mapOptions.streetViewControl = false;
                vm.mapOptions.draggable = false;
                vm.mapOptions.scrollwheel = false;
                vm.mapOptions.disableDoubleClickZoom = true;
                return true;
            }());
        }

        function onActionClicked(index) {
            var button = vm.actionSheetConfig.buttons[index];

            if (!!button && !!button.callback) {
                button.callback();
            }
        }

        function cancelJob() {
            pboxPopup.confirm('Are you sure you want to cancel this job?')
                .then(function(res) {
                    if (res) {
                        startLoading();
                        jobService.update($stateParams.jobId, {
                                "status": "CANCELED"
                            })
                            .then(function(response) {
                                $state.go('my-jobs');
                            })
                            .catch(function(err) {
                                pboxPopup.alert('Operation failed!');
                            })
                            .finally(stopLoading);
                    }
                });
        }

        function unassignFromJob() {
            return pboxPopup.confirm('Are you sure you want to unassing from this job?')
                .then(function(response) {
                    if (response) {
                        startLoading();
                        return jobService.unassign(vm.job);
                    }
                    return null;
                })
                .then(function(response) {
                    if (response) {
                        //pboxPopup.alert('You have unassinged from job !');
                        $state.go('my-jobs');
                    }
                })
                .catch(function(err) {
                    pboxPopup.alert('Operation failed!');
                })
                .finally(stopLoading);
        }

        function completeJob() {
            pboxPopup.confirm('Are you sure you want to complete this job?')
                .then(function(res) {
                    if (res) {
                        startLoading();
                        jobService.update($stateParams.jobId, {
                                "status": "COMPLETED"
                            })
                            .then(function(response) {
                                vm.job = response;
                            })
                            .catch(function(err) {
                                pboxPopup.alert('Operation failed!');
                            })
                            .finally(stopLoading);
                    }
                });
        }

        function addBoxToJob() {
            $state.go('job-add-box', { jobId: vm.job.id });   
        }

        function editJob() {
            $state.go('job-edit', { jobId: vm.job.id });
        }

        function openActions() {
            vm.actionsClose = $ionicActionSheet.show(vm.actionSheetConfig);
        }

        function showOnMap() {
            $state.go('job-map', { jobId: vm.job.id });
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
