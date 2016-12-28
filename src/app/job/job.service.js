(function() {
    angular
        .module('pbox.courier.job')
        .service('jobService', jobService);

    function jobService(JobModel, pboxApi, config) {

        var service = this;

        service.getAll = getAllJobs;

        ///////////////////////////////////////////

        function getAllJobs() {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.JOBS,
                    params: {
                        "status": config.jobStatus.PENDING
                    }
                })
                .then(function(response) {
                    var jobs = [];

                    if (response.length) {
                        for (var i = 0; i < response.length; i++) {
                            jobs[i] = new JobModel(response[i])
                        }
                    }

                    return jobs;
                });
        }

    }

})();