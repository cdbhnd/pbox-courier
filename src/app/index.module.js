(function (angular) {
    angular
        .module('pbox.courier', ['angularMoment',
            'ionic',
            'ngCordova',
            'ngStorage',
            'pbox.courier.geolocation',
            'pbox.courier.api',
            'pbox.courier.auth',
            'pbox.courier.loader',
            'pbox.courier.nav',
            'pbox.courier.job',
            'pbox.courier.popup',
            'pbox.courier.map',
            'qrScanner',
            'pbox.courier.iot'
        ])
        .run(function ($rootScope, $state, $ionicPlatform, $window, $localStorage, geolocationService, authService) {
            $ionicPlatform.ready(function () {
                if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
                    //Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    //for form inputs)
                    $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    //Don't remove this line unless you know what you are doing. It stops the viewport
                    //from snapping when text inputs are focused. Ionic handles this internally for
                    //a much nicer keyboard experience.
                    $window.cordova.plugins.Keyboard.disableScroll(true);
                }
                if ($window.StatusBar) {
                    $window.StatusBar.styleDefault();
                }
                geolocationService.init();
                authService.init();
                $rootScope.currentState = $state.current;
                $rootScope.$on('$stateChangeStart', stateChangeStart);
                $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

                function stateChangeSuccess(event, toState) {
                    $rootScope.currentState = toState;
                }

                function stateChangeStart(event, toState) {
                    if ((toState.data && toState.data.authRequired) && !$localStorage.currentUser) {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });
        });
})(window.angular);
