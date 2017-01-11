gulp --test --buildonly &&
aws s3 sync www/ s3://pbox-dev --profile pbox --region eu-central-1 --acl public-read-write