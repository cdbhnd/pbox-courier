(function (angular) {
    angular
        .module('pbox.courier')
        .factory('JobModel', jobModelFactory);

    /**@ngInject */
    function jobModelFactory(moment, GeolocationModel) {
        function JobModel(obj) {
            this.id = obj && obj.id ? obj.id : null;
            this.pickup = obj && obj.pickup ? new GeolocationModel(obj.pickup) : null;
            this.size = obj && obj.size ? obj.size : null;
            this.status = obj && obj.status ? obj.status : null;
            this.name = obj && obj.name ? obj.name : null;
            this.description = obj && obj.description ? obj.description : null;
            this.owner = obj && obj.owner ? obj.owner : null;
            this.createdAt = obj && obj.createdAt ? moment(obj.createdAt) : null;
            this.courierId = obj && obj.courierId ? obj.courierId : null;
            this.destination = obj && obj.destination ? new GeolocationModel(obj.destination) : null;
            this.receiverName = obj && obj.receiverName ? obj.receiverName : null;
            this.receiverPhone = obj && obj.receiverPhone ? obj.receiverPhone : null;
            this.box = obj && obj.box ? obj.box : null;
        }
        return JobModel;
    }
})(window.angular);
