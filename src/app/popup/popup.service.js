(function() {
    angular
        .module('pbox.courier.popup')
        .service('pboxPopup', pboxPopup);

    function pboxPopup($ionicPopup, $cordovaToast) {

        var service = this;

        service.alert = riseAlert;
        service.confirm = riseConfirm;
        service.toast = showToast;

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

        function showToast(message) {
            try {
                return $cordovaToast.show(message, 'long', 'top')
                    .then(function(success) {
                        console.log("The toast was shown");
                    }, function(error) {
                        console.log("The toast was not shown due to " + error);
                    });
            } catch(e) {
                alert(message);
            }
        }
    }

})();
