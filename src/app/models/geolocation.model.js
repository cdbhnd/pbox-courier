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
            this.message = obj && obj.message ? obj.message : '';
            this.address = obj && obj.address ? obj.address : '';
        }
        return GeolocationModel;
    }
})();