(function (angular) {
    angular
        .module('pbox.courier.job')
        .directive('jobList', jobList);

    /**@ngInject */
    function jobList() {
        return {
            restrict: 'E',
            link: link,
            templateUrl: 'app/job/job.list.html',
            scope: {
                jobs: '=',
                onJobClick: '=?',
                swipeActions: '=?'
            }
        };

        function link(scope) {
            var perPage = 10;
            var pageIndex = 1;
            var ininitiveScrollEnabled = true;

            scope.jobs = scope.jobs ? scope.jobs : [];
            scope.jobsList = [];
            scope.onJobClick = scope.onJobClick ? scope.onJobClick : function () { return true; };
            scope.swipeActions = scope.swipeActions ? sanitizeSwipeActions(scope.swipeActions) : [];
            scope.listCanSwipe = !!scope.swipeActions.length;
            scope.actionClicked = actionClicked;
            scope.loadMoreJobs = loadMoreJobs;

            /////////////////////////////////////////////////////

            (function () {
                scope.$watchCollection('jobs', function () {
                    ininitiveScrollEnabled = true;
                    pageIndex = 1;
                    scope.jobsList = scope.jobs; //loadInitJobs();
                });
            }());

            /////////////////////////////////////////////////////

            function sanitizeSwipeActions(swipeActions) {
                if (!swipeActions.length) {
                    return [];
                }
                for (var i = 0; i < swipeActions.length; i++) {
                    swipeActions[i].button = swipeActions[i].button ? swipeActions[i].button : 'button-main';
                    swipeActions[i].onClick = swipeActions[i].onClick ? swipeActions[i].onClick : function () { return true; };
                    swipeActions[i].icon = swipeActions[i].icon ? swipeActions[i].icon : 'ion-checkmark-round';
                }
                return swipeActions;
            }

            function actionClicked(job, index, $event) {
                scope.swipeActions[index].onClick(job);
                $event.stopPropagation();
            }

            function loadMoreJobs() {
                if (!ininitiveScrollEnabled) {
                    scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
                console.log('load more');
                pageIndex++;
                var min = scope.jobsList.length;
                var max;
                if (scope.jobs.length <= (pageIndex * perPage)) {
                    ininitiveScrollEnabled = false;
                    max = scope.jobs.length;
                } else {
                    max = (pageIndex * perPage);
                }
                for (var i = min; i < max; i++) {
                    scope.jobsList.push(scope.jobs[i]);
                }
                scope.$broadcast('scroll.infiniteScrollComplete');
                return true;
            }
        }
    }
})(window.angular);
