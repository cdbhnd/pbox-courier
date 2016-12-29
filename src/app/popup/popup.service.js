(function() {
    angular
        .module('pbox.courier.popup')
        .service('pboxPopup', pboxPopup);

    function pboxPopup($ionicPopup) {

        var service = this;

        service.alert = riseAlert;
        service.confirm = riseConfirm;

        ///////////////////////////////////////////

        function riseAlert(text) {
            return $ionicPopup.alert({
                title: text,
                template: '',
                buttons: [{
                    text: 'OK',
                    type: 'button-energized'
                }]
            });
        }

        function riseConfirm(text) {
            return $ionicPopup.confirm({
                title: text,
                template: '',
                buttons: [{
                    text: 'Yes',
                    type: 'button-balanced',
                    onTap: function() {
                        return true;
                    }
                }, {
                    text: 'No',
                    type: 'button-assertive',
                    onTap: function() {
                        return false;
                    }
                }]
            });
        }
    }

})();