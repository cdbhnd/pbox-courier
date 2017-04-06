(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('jobController', jobController);

    /**@ngInject */
    function jobController($scope, $q, $interval, $localStorage, $state, jobService, pboxLoader, pboxPopup,
        UserModel, authService, orderByFilter, jobConfig, config) {
        var vm = this;

        //variables and properties
        var user = new UserModel(authService.currentUser());
        var polling = {
            promise: null,
            enabled: config.jobPolling.enabled,
            interval: config.jobPolling.interval
        };

        vm.jobs = [];
        vm.listCanSwipe = true;
        vm.jobActions = [{
            onClick: locateJob,
            button: 'button-energized',
            icon: 'ion-location'
        }, {
            onClick: acceptJob,
            button: 'button-main',
            icon: 'ion-checkmark-round'
        }];

        //public methods
        vm.refreshList = refreshList;
        vm.selectJob = selectJob;
        vm.acceptJob = acceptJob;
        vm.locateJob = locateJob;

        /////////////////////////////////////
        //**Activate */
        (function () {
            startLoading()
                .then(loadUser)
                .then(loadJobs)
                .then(pollJobs)
                .then(cancelPollingPromiseOnScopeDestroy)
                .finally(stopLoading);
        }());

        /////////////////////////////////////

        function startLoading() {
            return pboxLoader.loaderOn();
        }

        function loadUser() {
            return authService.currentUser()
                .then(function (response) {
                    user = new UserModel(response);
                });
        }

        function loadJobs() {
            return jobService.get({
                    status: jobConfig.jobStatuses.pending
                })
                .then(function (response) {
                    if (response.length === 0) {
                        riseAlertPopup(jobConfig.messages.noJobsInArea);
                        return;
                    }
                    vm.jobs = orderByFilter(response, 'createdAt', true);
                });
        }

        function pollJobs() {
            return $q.when(function () {
                if (!polling.enabled) {
                    return false;
                }
                polling.promise = $interval(function () {
                    return jobService.get({
                            status: jobConfig.jobStatuses.pending
                        })
                        .then(function (response) {
                            var orderedJobs = orderByFilter(response, 'createdAt', true);
                            var numberOfNewJobs = orderedJobs.length - vm.jobs.length;
                            if (numberOfNewJobs > 0) {
                                var newJobs = orderedJobs.slice(0, numberOfNewJobs);
                                for (var i = (newJobs.length - 1); i >= 0; i--) {
                                    vm.jobs.unshift(newJobs[i]);
                                }
                                pboxPopup.toast('Added ' + numberOfNewJobs + ' new job(s)');
                            }
                        });
                }, polling.interval);
                return true;
            }());
        }

        function cancelPollingPromiseOnScopeDestroy() {
            return $q.when(function () {
                $scope.$on('$destroy', function () {
                    if (!!polling.promise) {
                        $interval.cancel(polling.promise);
                    }
                });
                return true;
            }());
        }

        function stopLoading() {
            return pboxLoader.loaderOff();
        }

        function acceptJob(job) {
            startLoading()
                .then(tryAcceptJob(job.id, user.id))
                .then(loadJobs)
                .then(stopLoading)
                .then(function () {
                    changeState(jobConfig.states.myJobs);
                });
        }

        function tryAcceptJob(jobId, courierId) {
            return jobService.accept(jobId, courierId);
        }

        function refreshList() {
            loadJobs()
                .then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function selectJob(job) {
            riseConfirmPopup(jobConfig.messages.wannaAcceptJob)
                .then(function (response) {
                    if (response) {
                        acceptJob(job);
                    }
                });
        }

        function locateJob(job) {
            changeState(jobConfig.states.jobMap, { jobId: job.id });
        }

        function riseAlertPopup(msg) {
            return pboxPopup.alert(msg);
        }

        function riseConfirmPopup(msg) {
            return pboxPopup.config(msg);
        }

        function changeState(name, param) {
            return $state.go(name, param);
        }
    }
})(window.angular);
