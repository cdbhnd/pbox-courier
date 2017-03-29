(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('jobsController', jobsController);

    /**@ngInject */
    function jobsController($scope, $q, $interval, $localStorage, $state,
        jobService, pboxLoader, pboxPopup, UserModel, authService, orderByFilter) {
        var vm = this;
        var user = new UserModel(authService.currentUser());
        var pollingPromise;

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

        function refreshList() {
            loadJobs()
                .then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function selectJob(job) {
            pboxPopup.confirm('Would you accept job?')
                .then(function (response) {
                    if (response) {
                        acceptJob(job);
                    }
                });
        }

        ////////////////////////////////////

        function loadUser() {
            return authService.currentUser()
                .then(function (response) {
                    user = new UserModel(response);
                });
        }

        function loadJobs() {
            return jobService.get({
                status: 'PENDING'
            })
                .then(function (response) {
                    vm.jobs = orderByFilter(response, 'createdAt', true);
                    if (response.length === 0) {
                        pboxPopup.alert('There is no available jobs in your area!');
                    }
                });
        }

        function pollJobs() {
            return $q.when(function () {
                pollingPromise = $interval(function () {
                    return jobService.get({
                        status: 'PENDING'
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
                }, 15000);
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

        function acceptJob(job) {
            var jobId = job.id;
            var courierId = user.id;
            startLoading();
            return jobService.accept(jobId, courierId)
                .then(loadJobs)
                .then(stopLoading)
                .then(function () {
                    $state.go('my-jobs');
                });
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

        function locateJob(job) {
            $state.go('job-map', { jobId: job.id });
        }
    }
})(window.angular);
