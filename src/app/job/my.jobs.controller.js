(function (angular) {
    angular
        .module('pbox.courier.job')
        .controller('myJobsController', myJobsController);

    /**@ngInject */
    function myJobsController($scope, $q, $timeout, $localStorage, $state, jobService, pboxLoader, pboxPopup, UserModel, authService) {
        var vm = this;
        var user;

        vm.jobs = [];
        vm.listCanSwipe = true;
        vm.swipeActions = [{
            onClick: unassignFromJob,
            button: 'button-energized',
            icon: 'ion-link'
        }];

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

        function openJob(job) {
            if (job.status != 'CANCELED') {//eslint-disable-line eqeqeq
                $state.go('job-details', {
                    jobId: job.id
                });
            }
        }

        function refreshList() {
            loadJobs()
                .then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
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
                    if (response.length == 0) {//eslint-disable-line eqeqeq
                        pboxPopup.alert('No jobs available!');
                    }
                });
        }

        function unassignFromJob(job) {
            return pboxPopup.confirm('Are you sure you want to unassing from this job?')
                .then(function (response) {
                    if (response) {
                        startLoading();
                        jobService.unassign(job);
                    }
                })
                .then(function (response) {
                    if (response) {
                        loadJobs();
                    }
                })
                .catch(function () {
                    pboxPopup.alert('Operation failed!');
                })
                .finally(stopLoading);
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
