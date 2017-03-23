(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('jobDetailsController', jobDetailsController);

    /**@ngInject */
    function jobDetailsController($interval, $scope, $q, $timeout, $ionicPopup, jobService, pboxLoader, pboxPopup, $stateParams, $state, mapConfig, geolocationService, $ionicActionSheet) {
        var vm = this;

        //public methods
        vm.cancelJob = cancelJob;
        vm.unassignFromJob = unassignFromJob;
        vm.completeJob = completeJob;
        vm.openActions = openActions;
        vm.actionsClose = null;
        vm.showOnMap = showOnMap;
        vm.markerColors = ['#33CBCC', '#3F5877'];
        vm.box = null;

        //variables and properties
        var pollingPromise;
        vm.job = null;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.actionSheetConfig = {
            buttons: [],
            cancelText: 'Close',
            buttonClicked: onActionClicked
        };

        /////////////////////////////////////

        (function () {
            startLoading()
                .then(pollBoxStatus)
                .then(getCurrentLocation)
                .then(loadMapOptions)
                .then(loadJob)
                .then(loadMapMarkers)
                .then(loadBox)
                .then(cancelPollingPromiseOnScopeDestroy)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function getCurrentLocation() {
            return geolocationService.currentLocation()
                .then(function (coords) {
                    vm.mapOptions.mapCenter = coords;
                    return true;
                });
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

        function loadMapMarkers() {
            return $q.when(function () {
                vm.mapMarkers.push(vm.job.pickup);
                if (!!vm.job.destination && vm.job.destination.valid()) {
                    vm.mapMarkers.push(vm.job.destination);
                }
            }());
        }

        function loadBox() {
            if (!vm.job.box) {
                return true;
            }

            return jobService.getBox(vm.job.box)
                .then(function (response) {
                    vm.box = response;
                    vm.box.activate();
                    $scope.$on('$destroy', function () {
                        vm.box.deactivate();
                    });
                    return true;
                });
        }

        function loadMapOptions() {
            return $q.when(function () {
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
                .then(function (res) {
                    if (res) {
                        startLoading();
                        jobService.update($stateParams.jobId, {
                            status: 'CANCELED'
                        })
                            .then(function () {
                                $state.go('my-jobs');
                            })
                            .then(function () {
                                vm.box = null;
                            })
                            .catch(function () {
                                pboxPopup.alert('Operation failed!');
                            })
                            .finally(stopLoading);
                    }
                });
        }

        function unassignFromJob() {
            return pboxPopup.confirm('Are you sure you want to unassing from this job?')
                .then(function (response) {
                    if (response) {
                        startLoading();
                        return jobService.unassign(vm.job);
                    }
                    return null;
                })
                .then(function (response) {
                    if (response) {
                        //pboxPopup.alert('You have unassinged from job !');
                        $state.go('my-jobs');
                    }
                })
                .catch(function () {
                    pboxPopup.alert('Operation failed!');
                })
                .finally(stopLoading);
        }

        function completeJob() {
            pboxPopup.confirm('Are you sure you want to complete this job?')
                .then(function (res) {
                    if (res) {
                        startLoading();
                        jobService.update($stateParams.jobId, {
                            status: 'COMPLETED'
                        })
                            .then(function (response) {
                                vm.job = response;
                            })
                            .then(function () {
                                $state.go('my-jobs');
                            })
                            .then(function () {
                                vm.box = null;
                            })
                            .catch(function () {
                                pboxPopup.alert('Operation failed!');
                            })
                            .finally(stopLoading);
                    }
                });
        }

        function reactivateBox() {
            return jobService.reactivateBox(vm.job.box)
                .then(function (response) {
                    vm.box = response;
                })
                .catch(function () {
                    pboxPopup.alert('Operation failed!');
                });
        }

        function addBoxToJob() {
            $state.go('job-add-box', { jobId: vm.job.id });
        }

        function editJob() {
            $state.go('job-edit', { jobId: vm.job.id });
        }

        function openActions() {
            setActionButtons();
            vm.actionsClose = $ionicActionSheet.show(vm.actionSheetConfig);
        }

        function setActionButtons() {
            //delete previously added buttons
            vm.actionSheetConfig.buttons.length = 0;

            //EDIT JOB BUTTON
            if (!!vm.job && vm.job.status === 'ACCEPTED') {
                vm.actionSheetConfig.buttons.push({ text: 'Edit', callback: editJob });
            }

            //COMPLETE JOB BUTTON
            if (!!vm.job && vm.job.status === 'IN_PROGRESS') {
                vm.actionSheetConfig.buttons.push({ text: 'Complete', callback: completeJob });
            }

            //UNASSIGN JOB BUTTON
            if (!!vm.job && vm.job.status === 'ACCEPTED') {
                vm.actionSheetConfig.buttons.push({ text: 'Unassign', callback: unassignFromJob });
            }

            //CANCEL JOB BUTTON
            if (!!vm.job && vm.job.status === 'ACCEPTED' || !!vm.job && vm.job.status === 'IN_PROGRESS') {
                vm.actionSheetConfig.buttons.push({ text: 'Cancel', callback: cancelJob });
            }

            //ADD BOX BUTTON
            if ((!!vm.job && vm.job.status === 'ACCEPTED') && !!vm.job.destination.address) {
                vm.actionSheetConfig.buttons.push({ text: 'Add Box', callback: addBoxToJob });
            }

            //REACTIVATE BOX BUTTON
            if (!!vm.box && vm.box.status === 'SLEEP') {
                vm.actionSheetConfig.buttons.push({ text: 'Reactivate box', callback: reactivateBox });
            }
        }

        function loadBoxStatus() {
            if (!vm.box) {
                return true;
            }

            return jobService.getBoxStatus(vm.job.box)
                .then(function (response) {
                    vm.box.status = response.status;
                    return true;
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        function pollBoxStatus() {
            return $q.when(function () {
                pollingPromise = $interval(function () {
                    return loadBoxStatus();
                }, 10000);
                return true;
            }());
        }

        function cancelPollingPromiseOnScopeDestroy() {
            return $q.when(function () {
                $scope.$on('$destroy', function () {
                    if (!!pollingPromise) {
                        $interval.cancel(pollingPromise);
                    }
                });
                return true;
            }());
        }

        function showOnMap() {
            $state.go('job-map', { jobId: vm.job.id });
        }

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
    }
})(window.angular);
