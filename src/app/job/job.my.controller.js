(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('jobMyController', jobMyController);

    /**@ngInject */
    function jobMyController($scope, $q, $timeout, $localStorage, $state, jobConfig, jobService, pboxLoader, pboxPopup, UserModel, authService) {
        var vm = this;

        //variables and properties
        var user;
        vm.jobs = [];
        vm.listCanSwipe = true;
        vm.swipeActions = [{
            onClick: tryToUnassignFromJob,
            button: 'button-energized',
            icon: 'ion-link'
        }];

        //public methods
        vm.openJob = openJob;
        vm.refreshList = refreshList;

        /////////////////////////////////////
        //**Activate */
        (function () {
            startLoading()
                .then(loadUser)
                .then(loadJobs)
                .finally(stopLoading);
        }());

        ////////////////////////////////////

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
                    courierId: user.id
                })
                .then(function (response) {
                    vm.jobs = response;
                    if (response.length == 0) {
                        riseAlertPopup(jobConfig.messages.noAvailableJobs);
                    }
                });
        }

        function stopLoading() {
            return pboxLoader.loaderOff();
        }

        function openJob(job) {
            if (job.status != jobConfig.jobStatuses.canceled) {
                $state.go(jobConfig.states.jobDetails, { jobId: job.id });
            }
        }

        function refreshList() {
            loadJobs()
                .then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function tryToUnassignFromJob(job) {
            riseConfirmPopup(jobConfig.messages.wannaUnassigneJob)
                .then(function (response) {
                    if (!response) {
                        return;
                    }
                    startLoading()
                        .then(unassignFromJob(job));
                })
                .catch(function () {
                    riseAlertPopup(jobConfig.messages.failedOperation);
                })
                .finally(stopLoading);
        }

        function unassignFromJob(jobObj) {
            return jobService.unassign(jobObj)
                .then(refreshState);
        }

        function riseAlertPopup(msg) {
            return pboxPopup.alert(msg);
        }

        function riseConfirmPopup(msg) {
            return pboxPopup.confirm(msg);
        }

        function refreshState() {
            return $state.reload();
        }
    }
})(window.angular);
