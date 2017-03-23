(function (angular) {
    angular
        .module('pbox.courier.nav')
        .controller('navController', navController);

    /**@ngInject */
    function navController($state, $ionicHistory) {
        var vm = this;

        vm.changeState = changeState;
        vm.back = back;

        /////////////////////////////////////


        /////////////////////////////////////

        function changeState(state) {
            $state.go(state);
        }

        function back() {
            $ionicHistory.goBack(-1);
        }
    }
})(window.angular);
