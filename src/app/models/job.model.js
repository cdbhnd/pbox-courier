(function() {
    'use strict';

    angular
        .module('pbox.courier')
        .factory('JobModel', jobModelFactory);

    /** @ngInject */
    function jobModelFactory(moment) {

        function JobModel(obj) {
            this.id = obj && obj.id ? obj.id : null;
            this.pickup = obj && obj.pickup ? obj.pickup : null;
            this.size = obj && obj.size ? obj.size : null;
            this.status = obj && obj.status ? obj.status : null;
            this.name = obj && obj.name ? obj.name : null;
            this.owner = obj && obj.owner ? obj.owner : null;
            this.createdAt = obj && obj.createdAt ? moment(obj.createdAt) : null;
        }
        return JobModel;
    }
})();