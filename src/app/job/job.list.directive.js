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

            scope.jobs = scope.jobs ? scope.jobs : [];
            scope.onJobClick = scope.onJobClick ? scope.onJobClick : function() {};
            scope.swipeActions = scope.swipeActions ? sanitizeSwipeActions(scope.swipeActions) : [];
            scope.listCanSwipe = !!scope.swipeActions.length;

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
        }
    }
})();
