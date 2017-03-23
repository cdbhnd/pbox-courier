(function (angular) {
    angular
        .module('pbox.courier.geolocation')
        .service('geolocationService', geolocationService);

    /**@ngInject */
    function geolocationService($q, $rootScope, GeolocationModel, $cordovaGeolocation, config) {
        var service = this;

        service.init = init;
        service.currentLocation = currentLocation;

        var location;

        //////////////////////////////

        function init() {
            if (isDemoLocationEnabled()) {
                location = getDemoLocation();
                $rootScope.current_location = location;
            } else {
                getCurrentLocation();
            }
        }

        function currentLocation() {
            return $q.when(function () {
                while (!location) {
                    //wait until the locaiton is defined
                }
                return location;
            }());
        }

        function setFallbackCoordinates(message) {
            var randomCoords = randomGeo({
                latitude: 44.802433,
                longitude: 20.466403
            }, 10000);
            location = new GeolocationModel({
                latitude: parseFloat(randomCoords.latitude),
                longitude: parseFloat(randomCoords.longitude),
                message: message
            });
            $rootScope.current_location = location;
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

            var newlat = y + y0;
            var newlon = x + x0;

            return {
                latitude: newlat.toFixed(8),
                longitude: newlon.toFixed(8)
            };
        }
        function isDemoLocationEnabled() {
            return !!config.demoLocation && (config.demoLocation.hardcoded || config.demoLocation.random);
        }

        function getDemoLocation() {
            var geoLocationModel = new GeolocationModel();

            if (config.demoLocation.hardcoded) {
                geoLocationModel.latitude = config.demoLocation.lat;
                geoLocationModel.longitude = config.demoLocation.lng;
            } else if (config.demoLocation.random) {
                var randomCordinates = randomGeo({ latitude: config.demoLocation.lat, longitude: config.demoLocation.lng },
                    config.demoLocation.radius);
                geoLocationModel.latitude = randomCordinates.latitude;
                geoLocationModel.longitude = randomCordinates.longitude;
            }
            return geoLocationModel;
        }

        function getCurrentLocation() {
            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    location = new GeolocationModel({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    $rootScope.current_location = location;
                    console.log('Location fetch: ');
                    console.log(location);
                }, function (err) {
                    console.log(err.message);
                    setFallbackCoordinates(err.message);
                });

            var watchOptions = {
                timeout: 3000,
                enableHighAccuracy: false //may cause errors if true
            };
            $cordovaGeolocation.watchPosition(watchOptions)
                .then(null,
                function (err) {
                    console.log(err.message);
                    if (!location) {
                        setFallbackCoordinates(err.message);
                    }
                },
                function (position) {
                    location = new GeolocationModel({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    $rootScope.current_location = location;
                    console.log('Location watch: ');
                    console.log(location);
                }
                );
        }
    }
})(window.angular);
