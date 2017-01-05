(function() {
    'use strict';

    angular
        .module('pbox.courier.map')
        .directive('mapPane', mapPaneDirective);

    /** @ngInject */
    function mapPaneDirective($q) {

        return {
            restrict: 'E',
            link: link,
            replace: true,
            templateUrl: 'app/map/map.html',
            scope: {
                mapOptions: '=',
                mapMarkers: '='
            }
        };

        function link(scope, element, attrs) {

            var markerIcon = {
                path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
                fillColor: '#6f1f1d',
                fillOpacity: 0.8,
                scale: 0.8,
                strokeColor: '',
                strokeWeight: 0
            };

            scope.mapId = null;
            scope.map = null;

            (function activate() {
                subscribeOnOptionsChange()
                    .then(subscribeOnMarkersChange);
            }());

            function subscribeOnOptionsChange() {
                return $q.when(function() {
                    scope.$watch('mapOptions', function() {
                    	if (!scope.mapOptions.center) {
                    		return false;
                    	}
                        var center = new google.maps.LatLng(scope.mapOptions.center.latitude, scope.mapOptions.center.longitude);
                        scope.mapId = guid();
                        scope.map = new google.maps.Map(document.getElementById(scope.mapId), scope.mapOptions);
                        var marker = new google.maps.Marker({
                            map: scope.map,
                            position: center,
                            icon: scope.mapOptions.centerIcon ? scope.mapOptions.centerIcon : 'images/current_position.png'
                        });
                        return true;
                    });
                }());
            }

            function subscribeOnMarkersChange() {
                return $q.when(function() {
                    scope.$watch('mapMarkers', function() {
                        if (!scope.map || !scope.mapMarkers) {
                        	return false;
                        }
                        for (var i = 0; i < scope.mapMarkers; i++) {
                            buildMarker(scope.mapMarkers[i].latitude, scope.mapMarkers[i].longitude, scope.map);
                        }
                        return true;
                    }, true);
                }());
            }

            function buildMarker(latitude, longitude, map) {
                var m = new google.maps.Marker({
                    map: map,
                    animation: google.maps.Animation.DROP,
                    position: new google.maps.LatLng(latitude, longitude),
                    icon: markerIcon
                });
                return m;
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
})();
