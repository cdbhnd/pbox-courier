(function() {
    angular
        .module('pbox.courier.alert')
        .service('pboxAlert', pboxAlert);

    function pboxAlert($ionicPopup) {

        var service = this;

        service.alert = riseAlert;

        ///////////////////////////////////////////

        function riseAlert(text) {
            $ionicPopup.alert({
                title: text,
                template: '',
                buttons: [{
                    text: 'OK',
                    type: 'button-energized'
                }]
            });
        }
    }

})();