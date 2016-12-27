(function() {
    'use strict';

    angular
        .module('pbox.courier')
        .factory('GeolocationModel', geolocationModelFactory);

    /** @ngInject */
    function geolocationModelFactory() {

        function GeolocationModel(obj) {
            this.latitude = obj && obj.latitude ? obj.latitude : null;
            this.longitude = obj && obj.longitude ? obj.longitude : null;
        }
        return GeolocationModel;
    }
})();