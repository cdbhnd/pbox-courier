(function() {
    'use strict';

    angular
        .module('pbox.courier.geolocation')
        .service('geolocationService', geolocationService);

    /** @ngInject */
    function geolocationService($q, GeolocationModel, $cordovaGeolocation) {
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
                    console.log('Location fetch: ');
                    console.log(_currentLocation);
                }, function(err) {
                    setFallbackCoordinates();
                });

            var watchOptions = {
                timeout: 3000,
                enableHighAccuracy: false // may cause errors if true
            };
            $cordovaGeolocation.watchPosition(watchOptions)
                .then(null,
                    function(err) {
                        if (!_currentLocation) {
                            setFallbackCoordinates();
                        }
                    },
                    function(position) {
                        _currentLocation = new GeolocationModel({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
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

        function setFallbackCoordinates() {
            _currentLocation = new GeolocationModel({
                latitude: 44,
                longitude: 20
            });
        }
    }
})();