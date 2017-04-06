(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('jobDetailsController', jobDetailsController);

    /**@ngInject */
    function jobDetailsController($interval, $scope, $q, $timeout, $state, $stateParams, $ionicActionSheet, jobService, pboxLoader, pboxPopup, mapConfig, jobConfig, geolocationService) {
        var vm = this;

        //variables and properties
        var pollingPromise;
        vm.markerColors = ['#33CBCC', '#3F5877'];
        vm.actionsClose = null;
        vm.box = null;
        vm.job = null;
        vm.mapOptions = angular.copy(mapConfig.mapOptions);
        vm.mapMarkers = [];
        vm.actionSheetConfig = {
            buttons: [],
            cancelText: 'Close',
            buttonClicked: onActionClicked
        };

        //public methods
        vm.unassignFromJob = unassignFromJob;
        vm.cancelJob = cancelJob;
        vm.completeJob = completeJob;
        vm.openActions = openActions;
        vm.showOnMap = showOnMap;

        /////////////////////////////////////
        /**Activate */
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

        function startLoading() {
            return pboxLoader.loaderOn();
        }

        function pollBoxStatus() {
            return $q.when(function () {
                pollingPromise = $interval(function () {
                    return loadBoxStatus();
                }, 10000);
                return true;
            }());
        }

        function getCurrentLocation() {
            return geolocationService.currentLocation()
                .then(function (coords) {
                    vm.mapOptions.mapCenter = coords;
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


        function loadJob() {
            return jobService.getJob($stateParams.jobId)
                .then(function (response) {
                    if (!response) {
                        riseAlertPopup(jobConfig.messages.jobNotFound);
                    }
                    vm.job = response;
                })
                .catch(function () {
                    riseAlertPopup(jobConfig.messages.somethingWentWrong);
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

        function stopLoading() {
            return pboxLoader.loaderOff();
        }

        function unassignFromJob() {
            riseConfirmPopup(jobConfig.messages.wannaUnassigneJob)
                .then(function (response) {
                    if (response) {
                        startLoading()
                            .then(unassign(vm.job))
                            .then(changeState(jobConfig.states.myJobs));
                    }
                })
                .catch(function () {
                    riseAlertPopup(jobConfig.messages.failedOperation);
                })
                .finally(stopLoading);
        }

        function unassign(jobObj) {
            return jobService.unassign(jobObj);
        }

        function cancelJob() {
            riseConfirmPopup(jobConfig.messages.wannaCancelJob)
                .then(function (res) {
                    if (res) {
                        startLoading();
                        jobService.update($stateParams.jobId, {
                                status: jobConfig.jobStatuses.canceled
                            })
                            .then(function () {
                                $state.go(jobConfig.states.myJobs);
                            })
                            .then(function () {
                                vm.box = null;
                            })
                            .catch(function () {
                                riseAlertPopup(jobConfig.messages.failedOperation);
                            })
                            .finally(stopLoading);
                    }
                });
        }

        function completeJob() {
            riseConfirmPopup(jobConfig.messages.wannaCompleteJob)
                .then(function (res) {
                    if (res) {
                        startLoading();
                        jobService.update($stateParams.jobId, {
                                status: jobConfig.jobStatuses.completed
                            })
                            .then(function (response) {
                                vm.job = response;
                            })
                            .then(function () {
                                $state.go(jobConfig.states.myJobs);
                            })
                            .then(function () {
                                vm.box = null;
                            })
                            .catch(function () {
                                riseAlertPopup(jobConfig.messages.failedOperation);
                            })
                            .finally(stopLoading);
                    }
                });
        }

        function onActionClicked(index) {
            var button = vm.actionSheetConfig.buttons[index];

            if (!!button && !!button.callback) {
                button.callback();
            }
        }

        function showOnMap() {
            changeState(jobConfig.states.jobMap, { jobId: vm.job.id });
        }

        function reactivateBox() {
            return jobService.reactivateBox(vm.job.box)
                .then(function (response) {
                    vm.box = response;
                })
                .catch(function () {
                    riseAlertPopup(jobConfig.messages.failedOperation);
                });
        }

        function addBoxToJob() {
            changeState(jobConfig.states.jobAddBox, { jobId: vm.job.id });
        }

        function editJob() {
            changeState(jobConfig.states.jobEdit, { jobId: vm.job.id });
        }

        function openActions() {
            setActionButtons();
            vm.actionsClose = $ionicActionSheet.show(vm.actionSheetConfig);
        }

        function setActionButtons() {
            //delete previously added buttons
            vm.actionSheetConfig.buttons.length = 0;

            //EDIT JOB BUTTON
            if (!!vm.job && vm.job.status === jobConfig.jobStatuses.accepted) {
                vm.actionSheetConfig.buttons.push({ text: jobConfig.buttonValue.edit, callback: editJob });
            }

            //COMPLETE JOB BUTTON
            if (!!vm.job && vm.job.status === jobConfig.jobStatuses.inProgress) {
                vm.actionSheetConfig.buttons.push({ text: jobConfig.buttonValue.complete, callback: completeJob });
            }

            //UNASSIGN JOB BUTTON
            if (!!vm.job && vm.job.status === jobConfig.jobStatuses.accepted) {
                vm.actionSheetConfig.buttons.push({ text: jobConfig.buttonValue.unassign, callback: unassignFromJob });
            }

            //CANCEL JOB BUTTON
            if (!!vm.job && vm.job.status === jobConfig.jobStatuses.accepted || !!vm.job && vm.job.status === jobConfig.jobStatuses.inProgress) {
                vm.actionSheetConfig.buttons.push({ text: jobConfig.buttonValue.cancel, callback: cancelJob });
            }

            //ADD BOX BUTTON
            if ((!!vm.job && vm.job.status === jobConfig.jobStatuses.accepted) && !!vm.job.destination.address) {
                vm.actionSheetConfig.buttons.push({ text: jobConfig.buttonValue.addBox, callback: addBoxToJob });
            }

            //REACTIVATE BOX BUTTON
            if (!!vm.box && vm.box.status === jobConfig.boxStatuses.sleep) {
                vm.actionSheetConfig.buttons.push({ text: jobConfig.buttonValue.reactivateBox, callback: reactivateBox });
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
                });
        }

        function changeState(name, param) {
            return $state.go(name, param);
        }

        function riseAlertPopup(msg) {
            return pboxPopup.alert(msg);
        }

        function riseConfirmPopup(msg) {
            return pboxPopup.confirm(msg);
        }
    }
})(window.angular);
