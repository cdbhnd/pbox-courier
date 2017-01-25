(function() {
    angular
        .module('pbox.courier.job')
        .service('jobService', jobService);

    function jobService(JobModel, pboxApi, config, BoxModel) {

        var service = this;

        service.get = getJobs;
        service.accept = acceptJob;
        service.update = updateJob;
        service.getJob = getJob;
        service.unassign = unassign;
        service.getBox = getBox;

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
                            jobs[i] = new JobModel(response[i]);
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
                        id: jobId
                    }
                })
                .then(function(response) {
                    return new JobModel(response[0]);
                });
        }

        function getBox(boxId) {
            return pboxApi.http({
                    method: config.httpMethods.GET,
                    url: config.pboxAPI.BOXES + '/' + boxId
                })
                .then(function(response) {
                    return new BoxModel(response);
                })
                .catch(function(err){
                    console.log(err);
                });
        }

        function acceptJob(selectedJob, courier) {
            return pboxApi.http({
                method: config.httpMethods.PUT,
                url: config.pboxAPI.JOBS + '/' + selectedJob,
                data: {
                    courierId: courier
                }
            })
            .then(function(response) {
                return new JobModel(response);
            });
        }

        function updateJob(jobId, query) {
            return pboxApi.http({
                    method: config.httpMethods.PUT,
                    url: config.pboxAPI.JOBS + '/' + jobId,
                    data: query
                })
                .then(function(response) {
                    return new JobModel(response);
                });
        }

        function unassign(selectedJob) {
            return pboxApi.http({
                method: config.httpMethods.PUT,
                url: config.pboxAPI.JOBS + '/' + selectedJob.id,
                data: {
                    courierId: ''
                }
            })
            .then(function(response) {
                return new JobModel(response);
            });
        }
    }
})();