(function (angular, google) {
    angular
        .module('pbox.courier.map')
        .directive('mapPane', mapPaneDirective);

    /**@ngInject */
    function mapPaneDirective($q) {
        return {
            restrict: 'E',
            link: link,
            replace: true,
            templateUrl: 'app/map/map.html',
            scope: {
                mapOptions: '=',
                mapMarkers: '=',
                drawDirections: '&?',
                colorsArray: '='
            }
        };

        function link(scope) {
            var markerIcon = {
                path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
                fillColor: '#3F5877',
                fillOpacity: 0.9,
                scale: 0.8,
                strokeColor: '',
                strokeWeight: 0
            };
            var markers = [];
            var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
            var directionsService = new google.maps.DirectionsService();

            scope.mapId = guid();
            scope.map = null;
            scope.drawDirections = !!scope.drawDirections;
            //**Activate */
            (function () {
                subscribeOnOptionsChange()
                    .then(subscribeOnMarkersChange);
            }());

            function subscribeOnOptionsChange() {
                return $q.when(function () {
                    scope.$watch('mapOptions', function () {
                        if (!scope.mapOptions.mapCenter) {
                            return false;
                        }
                        var center = new google.maps.LatLng(scope.mapOptions.mapCenter.latitude, scope.mapOptions.mapCenter.longitude);
                        var opts = angular.copy(scope.mapOptions);
                        opts.center = center;
                        scope.map = new google.maps.Map(document.getElementById(scope.mapId), opts);
                        markers.push(new google.maps.Marker({
                            map: scope.map,
                            position: center,
                            icon: scope.mapOptions.centerIcon ? scope.mapOptions.centerIcon : 'images/current_position.png'
                        }));
                        return handleDirectionService();
                    }, true);
                }());
            }

            function subscribeOnMarkersChange() {
                return $q.when(function () {
                    scope.$watch('mapMarkers', function () {
                        if (!scope.map || !scope.mapMarkers) {
                            return false;
                        }
                        for (var i = 0; i < scope.mapMarkers.length; i++) {
                            buildMarker(scope.mapMarkers[i].latitude, scope.mapMarkers[i].longitude, scope.map, i);
                        }
                        var bounds = new google.maps.LatLngBounds();
                        for (var x = 0; x < markers.length; x++) {
                            bounds.extend(markers[x].getPosition());
                        }
                        scope.map.fitBounds(bounds);
                        return handleDirectionService();
                    }, true);
                }());
            }

            function buildMarker(latitude, longitude, map, i) {
                markers.push(new google.maps.Marker({
                    map: map,
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(latitude, longitude),
                    icon: createIcon(i)
                }));
            }

            function createIcon(i) {
                if (!!scope.colorsArray && !!scope.colorsArray[i]) {
                    markerIcon.fillColor = scope.colorsArray[i];
                    return markerIcon;
                }
                return markerIcon;
            }

            //handle the directions service
            function handleDirectionService() {
                return $q.when(function () {
                    if (markers.length < 2 || !scope.drawDirections) {
                        return false;
                    }
                    directionsService.route({
                        origin: getDirectionsStart(),
                        destination: getDirectionsEnd(),
                        waypoints: getDirectionWaypoints(),
                        optimizeWaypoints: true,
                        travelMode: google.maps.TravelMode.DRIVING
                    },
                        function (result, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                //removeMarkersFromMap();
                                directionsDisplay.setDirections(result);
                                directionsDisplay.setMap(scope.map);
                            }
                        });
                    return true;
                }());
            }

            function getDirectionsStart() {
                return markers[0].getPosition();
            }

            function getDirectionsEnd() {
                return markers[markers.length - 1].getPosition();
            }

            function getDirectionWaypoints() {
                var waypts = [];
                for (var i = 1; i < (markers.length - 1); i++) {
                    waypts.push({
                        location: markers[i].getPosition(),
                        stopover: true
                    });
                }
                return waypts;
            }
        }
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
})(window.angular);
