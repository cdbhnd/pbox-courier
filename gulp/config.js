(function() {
    'use strict';

    exports.paths = {
        bower_components: 'bower_components',
        config: 'config',
        dist: 'www',
        node_modules: 'node_modules',
        src: 'src',
        tmp: '.tmp',
        ionic: 'ionic'
    };

    exports.environments = {
        DEVELOPMENT: 'development',
        PRODUCTION: 'production',
        STAGING: 'staging',
        TEST: 'test',
    };

    exports.platforms = {
        WEB: 'web',
        ANDROID: 'android',
        IOS: 'ios'
    };

    exports.environmentsConfig = {
        development: { },
        production: { },
        staging: { },
        test: { }     
    };
}());
