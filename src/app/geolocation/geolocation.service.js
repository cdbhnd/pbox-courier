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
            var randomCoords = randomGeo({
                latitude: 44.802433,
                longitude: 20.466403
            }, 10000);
            _currentLocation = new GeolocationModel({
                latitude: parseFloat(randomCoords.latitude),
                longitude: parseFloat(randomCoords.longitude),
                message: message
            });
            $rootScope.current_location = _currentLocation;
        }

        function randomGeo(center, radius) {
            var y0 = center.latitude;
            var x0 = center.longitude;
            var rd = radius / 111300; //about 111300 meters in one degree

            var u = Math.random();
            var v = Math.random();

            var w = rd * Math.sqrt(u);
            var t = 2 * Math.PI * v;
            var x = w * Math.cos(t);
            var y = w * Math.sin(t);

            //Adjust the x-coordinate for the shrinking of the east-west distances
            var xp = x / Math.cos(y0);

            var newlat = y + y0;
            var newlon = x + x0;
            var newlon2 = xp + x0;

            return {
                latitude: newlat.toFixed(8),
                longitude: newlon.toFixed(8)
            };
        }
    }
})();
