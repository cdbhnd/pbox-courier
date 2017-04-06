(function (angular) {
    angular
        .module('pbox.courier.popup')
        .service('pboxPopup', pboxPopup);

    function pboxPopup($ionicPopup, $cordovaToast) {
        var service = this;

        //public methods
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
                    type: 'button-main'
                }]
            });
        }

        function riseConfirm(text) {
            return $ionicPopup.confirm({
                title: text,
                template: '',
                buttons: [{
                    text: 'Yes',
                    type: 'button-main',
                    onTap: function () {
                        return true;
                    }
                }, {
                    text: 'No',
                    type: 'button-main-inverse',
                    onTap: function () {
                        return false;
                    }
                }]
            });
        }

        function showToast(message) {
            try {
                $cordovaToast.show(message, 'long', 'top')
                    .then(function () {
                        console.log('The toast was shown');
                    }, function (error) {
                        console.log('The toast was not shown due to ' + error);
                    });
            } catch (e) {
                console.log(message);
            }
        }
    }
})(window.angular);
