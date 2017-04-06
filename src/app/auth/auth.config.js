(function (angular) {
    angular
        .module('pbox.courier.auth')
        .constant('authConfig', {
            errorMessages: {
                missingCredentials: 'Username or password is missing!',
                wrongCredentials: 'Wrong username or password!',
                genericError: 'Something went wrong, please try leater!'
            },
            states: {
                jobs: 'jobs'
            }
        });
})(window.angular);
