(function (angular) {
    angular
        .module('pbox.courier')
        .factory('UserModel', userModelFactory);

    /**@ngInject */
    function userModelFactory() {
        function UserModel(obj) {
            this.id = obj && obj.id ? obj.id : null;
            this.firstName = obj && obj.firstName ? obj.firstName : null;
            this.lastName = obj && obj.lastName ? obj.lastName : null;
            this.username = obj && obj.username ? obj.username : null;
            this.password = obj && obj.password ? obj.password : null;
            this.type = obj && obj.type ? obj.type : null;
            this.token = obj && obj.token ? obj.token : null;
        }
        return UserModel;
    }
})(window.angular);
