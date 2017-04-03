(function (angular) {
    angular
        .module('pbox.courier.job')
        .constant('jobConfig', {
            messages: {
                jobNotFound: 'Job could not be found!',
                wannaCancelJob: 'Do you really want to cancel this job?',
                failedOperation: 'Operation failed!',
                somethingWentWrong: 'Sorry, something went wrong!',
                wannaUnassigneJob: 'Are you sure you want to unassing from this job?',
                wannaCompleteJob: 'Are you sure you want to complete this job?',
                noAvailableJobs: 'No available jobs!',
                wannaAcceptJob: 'Would you accept job?',
                noJobsInArea: 'There is no available jobs in your area!',
                boxAssigned: 'Box assigned to the job!',
                boxNotAssigned: 'Box was not assigned to the job!'
            },
            jobStatuses: {
                canceled: 'CANCELED',
                accepted: 'ACCEPTED',
                inProgress: 'IN_PROGRESS',
                completed: 'COMPLETED',
                pending: 'PENDING'
            },
            boxStatuses: {
                sleep: 'SLEEP'
            },
            states: {
                myJobs: 'my-jobs',
                jobAddBox: 'job-add-box',
                jobEdit: 'job-edit',
                jobMap: 'job-map',
                jobDetails: 'job-details'
            },
            buttonValue: {
                edit: 'Edit',
                complete: 'Complete',
                unassign: 'Unassign',
                cancel: 'Cancel',
                addBox: 'Add Box',
                reactivateBox: 'Reactivate box'
            },
            fields: {
                errorMsg: 'These fields are required: ',
                savedMsg: 'Details have been saved!',
                boxSize: 'Box size',
                country: 'Country ',
                city: 'City ',
                streetName: 'Street name ',
                streetNumber: 'Street number '
            }
        });
})(window.angular);
