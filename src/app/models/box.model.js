(function (angular) {
    angular
        .module('pbox.courier')
        .factory('BoxModel', boxModelFactory);

    /**@ngInject */
    function boxModelFactory(iotService) {
        function BoxModel(obj) {
            this.id = obj && obj.id ? obj.id : null;
            this.code = obj && obj.code ? obj.code : null;
            this.size = obj && obj.size ? obj.size : null;
            this.status = obj && obj.status ? obj.status : null;
            this.host = obj && obj.host ? obj.host : null;
            this.topic = obj && obj.topic ? obj.topic : null;
            this.groundId = obj && obj.groundId ? obj.groundId : null;
            this.clientId = obj && obj.clientId ? obj.clientId : null;
            this.clientKey = obj && obj.clientKey ? obj.clientKey : null;
            this.deviceId = obj && obj.deviceId ? obj.deviceId : null;
            this.deviceName = obj && obj.deviceName ? obj.deviceName : null;
            this.gpsSensor = obj && obj.sensors ? findSensor(obj.sensors, 'GPS') : null;
            this.tempSensor = obj && obj.sensors ? findSensor(obj.sensors, 'TEMPERATURE') : null;
            this.accSensor = obj && obj.sensors ? findSensor(obj.sensors, 'ACCELEROMETER') : null;
            this.batterySensor = obj && obj.sensors ? findSensor(obj.sensors, 'BATTERY') : null;

            this.listen_active = false;
            this.sensors = obj && obj.sensors ? obj.sensors : [];
        }

        BoxModel.prototype.activate = function () {
            if (!this.listen_active) {
                iotService.listen(this);
                this.listen_active = true;
            }
        };

        BoxModel.prototype.deactivate = function () {
            if (this.listen_active) {
                iotService.stopListen(this.id);
                this.listen_active = false;
            }
        };

        BoxModel.prototype.setSensorValue = function (sensorId, value) {
            if (!!this.batterySensor && this.batterySensor.assetId === sensorId) {
                var batteryData = value.split(',');
                this.batterySensor.value = {
                    percentage: batteryData[0],
                    charging: batteryData[1]
                };
            }
        };

        return BoxModel;

        function findSensor(sensors, type) {
            for (var i = 0; i < sensors.length; i++) {
                if (sensors[i].type === type) {
                    return sensors[i];
                }
            }
            return null;
        }
    }
})(window.angular);
