var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
var s3 = new AWS.S3();

exports.handler = async function(event, context) {
    
    var params = {
        Bucket: process.env.originBucketName,
        MaxKeys: 100
    };

    var return_object;

    try {
        return_object = await s3.listObjectsV2(params).promise();
    } catch (e) {
        return_object = e;
    }

    return {
        statusCode: 200,
        headers: {'Content-Type': 'text/plain' },
        body: `${JSON.stringify(return_object, null, 2)}\n`
    };

}