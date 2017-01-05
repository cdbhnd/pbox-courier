(function() {
    'use strict';

    angular
        .module('pbox.courier.geolocation')
        .service('geolocationService', geolocationService);

    /** @ngInject */
    function geolocationService($q, $rootScope, GeolocationModel, $cordovaGeolocation) {
        var service = this;

        service.init = init;
        service.currentLocation = currentLocation;

        var _currentLocation;

        //////////////////////////////

        function init() {
            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    _currentLocation = new GeolocationModel({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    $rootScope.current_location = _currentLocation;
                    console.log('Location fetch: ');
                    console.log(_currentLocation);
                }, function(err) {
                    console.log(err.message);
                    setFallbackCoordinates(err.message);
                });

            var watchOptions = {
                timeout: 3000,
                enableHighAccuracy: false // may cause errors if true
            };
            $cordovaGeolocation.watchPosition(watchOptions)
                .then(null,
                    function(err) {
                        console.log(err.message);
                        if (!_currentLocation) {
                            setFallbackCoordinates(err.message);
                        }
                    },
                    function(position) {
                        _currentLocation = new GeolocationModel({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                        $rootScope.current_location = _currentLocation;
                        console.log('Location watch: ');
                        console.log(_currentLocation);
                    }
                );
        }

        function currentLocation() {
            return $q.when(function() {
                while (!_currentLocation) {}
                return _currentLocation;
            }());
        }

        function setFallbackCoordinates(message) {
            _currentLocation = new GeolocationModel({
                latitude: 44,
                longitude: 20,
                message: message
            });
            $rootScope.current_location = _currentLocation;
        }
    }
})();