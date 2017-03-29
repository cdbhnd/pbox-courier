(function () {
    'use strict';

    // Ionic PBOX App

    // angular.module is a global place for creating, registering and retrieving Angular modules
    // 'pbox.courier' is the name of this angular module example (also set in a <body> attribute in index.html)
    // the 2nd parameter is an array of 'requires'
    angular.module('pbox.courier', ['angularMoment',
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
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    $window.cordova.plugins.Keyboard.disableScroll(true);

                }
                if ($window.StatusBar) {
                    $window.StatusBar.styleDefault();
                }
                geolocationService.init();
                authService.init();
                $rootScope.current_state = $state.current;
                $rootScope.$on('$stateChangeStart', stateChangeStart);
                $rootScope.$on('$stateChangeSuccess',
                    function (event, toState, toParams, fromState, fromParams) {
                        $rootScope.current_state = toState;
                    });

                function stateChangeStart(event, toState, toParams) {
                    if ((toState.data && toState.data.authRequired) && !$localStorage.current_user) {
                        event.preventDefault();
                        $state.go('login');
                    }
                }
            });
        });
})();
