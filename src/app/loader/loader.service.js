(function() {
    angular
        .module('pbox.courier.loader')
        .service('pboxLoader', pboxLoader);

    function pboxLoader($ionicLoading) {

        var service = this;

        service.loaderOn = loaderOn;
        service.loaderOff = loaderOff;

        ///////////////////////////////////////////

        function loaderOn() {
            $ionicLoading.show({
                templateUrl: 'app/loader/loader.html'
            });
        }

        function loaderOff() {
            $ionicLoading.hide();
        }
    }

})();