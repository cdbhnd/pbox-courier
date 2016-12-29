(function() {
    angular
        .module('pbox.courier.job')
        .service('jobService', jobService);

    function jobService(JobModel, pboxApi, config) {

        var service = this;

        service.get = getJobs;
        service.accept = acceptJob;
        service.update = updateJob;
        service.getJob = getJob;

        ///////////////////////////////////////////

        function getJobs(query) {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.JOBS,
                    params: query
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

        function getJob(jobId) {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.JOBS,
                    params: {
                        "id": jobId
                    }
                })
                .then(function(response) {
                    return response[0];
                });
        }

        function acceptJob(selectedJob, courier) {
            return pboxApi.http({
                method: config.httpMethods.PUT,
                url: config.pboxAPI.JOBS + '/' + selectedJob,
                data: {
                    "courierId": courier
                }
            });
        }

        function updateJob(jobId, query) {
            return pboxApi.http({
                    method: config.httpMethods.PUT,
                    url: config.pboxAPI.JOBS + '/' + jobId,
                    data: query
                })
                .then(function(response) {
                    return response;
                });
        }
    }
})();