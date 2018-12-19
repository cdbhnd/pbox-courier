var bitballoon = require("bitballoon");
var Q = require('q');
var options = { access_token: "181590276a280e9e130006fdfa62ac63f64db03a69e6465989d283ae6e59e0a4" };
var client = bitballoon.createClient(options);

var siteName = 'pbox-courier';
var deployDir = 'www';

findSite(siteName)
    .then(deploySite)
    .then(function(deploy) {
        console.log('New deploy is created. Deploy Id ' + deploy.id);
    })
    .catch(function(err) {
        console.log(err);
    });

function findSite(name) {

    var deferred = Q.defer();

    client.sites(function(err, sites) {
            
        if (err) {
            deferred.reject(err);
        } else {
            var site = null;

            for (var i = 0; i < sites.length; i++) {
               
                if (sites[i].name === name) {
                    site = sites[i];
                }
            }

            if (site) {
                deferred.resolve(site);
            } else {
                deferred.reject('Site ' + name + ' could not be found.');
            }
        }
    });

    return deferred.promise;
}

function deploySite(site) {

    var deferred = Q.defer();

    site.createDeploy({ dir: deployDir },
        function(err, deploy) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(deploy);
            }
        });

    return deferred.promise;
}
