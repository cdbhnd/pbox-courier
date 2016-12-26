var argv = require('yargs').argv;
var gulp = require('gulp');
var config = require('./gulp/config');

// Detect and save environment (localy) by provided command line parameters
// Usage:
//    gulp                  start gulp task in 'development' mode, pointing to the local instance of the API (default)
//    gulp --test           start gulp task in 'development' mode, pointing to the remote instance of the API
//    gulp --staging        start gulp task in 'staging' mode
//    gulp --production     start gulp task in 'production' mode
//    gulp --XYZ            start gulp task in default 'development' mode
var _ENV = config.environments.DEVELOPMENT;
if (argv.test) { _ENV = config.environments.TEST; }
if (argv.staging) { _ENV = config.environments.STAGING; }
if (argv.production) { _ENV = config.environments.PRODUCTION; }

gulp.task('default', function() {
    require('./gulp/build.' + _ENV + '.js');
    gulp.start(_ENV);
});
