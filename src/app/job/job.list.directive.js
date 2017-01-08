(function() {

    angular
        .module('pbox.courier.job')
        .directive('jobList', jobList);

    /** @ngInject */
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

        function link(scope, element, attrs) {

            var _perPage = 10;
            var _pageIndex = 1;
            var _ininitiveScrollEnabled = true;

            scope.jobs = scope.jobs ? scope.jobs : [];
            scope.jobsList = [];
            scope.onJobClick = scope.onJobClick ? scope.onJobClick : function() {};
            scope.swipeActions = scope.swipeActions ? sanitizeSwipeActions(scope.swipeActions) : [];
            scope.listCanSwipe = !!scope.swipeActions.length;
            scope.actionClicked = actionClicked;
            scope.loadMoreJobs = loadMoreJobs;

            /////////////////////////////////////////////////////

            (function activate(){
                scope.$watchCollection('jobs', function() {
                    _ininitiveScrollEnabled = true;
                    _pageIndex = 1;
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
                    swipeActions[i].onClick = swipeActions[i].onClick ? swipeActions[i].onClick : function() {};
                    swipeActions[i].icon = swipeActions[i].icon ? swipeActions[i].icon : 'ion-checkmark-round';
                }
                return swipeActions;
            }

            function actionClicked(job, index, $event) {
                scope.swipeActions[index].onClick(job);
                $event.stopPropagation();
            }

            function loadMoreJobs() {
                if (!_ininitiveScrollEnabled) {
                    scope.$broadcast('scroll.infiniteScrollComplete');
                    return false;
                }
                console.log('load more');
                _pageIndex++;
                var min = scope.jobsList.length;
                var max; 
                if (scope.jobs.length <= (_pageIndex * _perPage)) {
                    _ininitiveScrollEnabled = false;
                    max = scope.jobs.length;   
                } else { 
                    max = (_pageIndex * _perPage); 
                }
                for (var i = min; i < max; i++) {
                    scope.jobsList.push(scope.jobs[i]);
                }
                scope.$broadcast('scroll.infiniteScrollComplete');
            }

            function loadInitJobs() {
                if (scope.jobs.length <= _perPage) {
                    _ininitiveScrollEnabled = false;
                    return scope.jobs;
                }
                var j = [];
                for (var i = 0; i < _perPage; i++) {
                    j.push(scope.jobs[i]);
                }
                return j;
            }
        }
    }
})();
