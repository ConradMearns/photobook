// `npm install --arch=x64 --platform=linux --target=10.16.0 sharp`
// If installed from Powershell, must be admin

const stream = require('stream')
var AWS = require('aws-sdk'); 
AWS.config.update({region: 'us-west-2'}); 
var S3 = new AWS.S3(); 
var sharp = require('sharp'); 
 
const readStreamFromS3 = ({ Bucket, Key }) => {
    return S3.getObject({ Bucket, Key }).createReadStream();
};

const writeStreamToS3 = ({ Bucket, Key }) => {
    const pass = new stream.PassThrough()
    return {
        writeStream: pass,
        uploadFinished: S3.upload({
            Body: pass,
            Bucket,
            ContentType: 'image/png',
            Key
        }).promise()
    }
};

const streamToSharp = ({ width, height }) => {
    return sharp()
        .resize(width, height)
        .toFormat('png')
}

exports.handler =  async function(event, context) {
    const ORIGIN_BUCKET = process.env.ORIGIN_BUCKET_NAME;
    const DESTINATION_BUCKET = process.env.DESTINATION_BUCKET_NAME;
    const URL = process.env.DESTINATION_BUCKET_URL;

    // Try to get image at path (dsdhjkas.com/prod/XXXxYYY/DSC_00008.JPG)
    var path = event["path"];
    const match = path.match(/(\d+)x(\d+)\/(.*)/)
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    const original_key = match[3];
    
    const new_key = '' + width + 'x' + height + '/' + original_key;
    const image_location = `${URL}/${new_key}`

    try {
        const readStream = readStreamFromS3({ Bucket: ORIGIN_BUCKET, Key: original_key })
        const resizeStream = streamToSharp({ width, height })
        const {
            writeStream,
            uploadFinished
        } = writeStreamToS3({ Bucket: DESTINATION_BUCKET, Key: new_key })

        readStream
            .pipe(resizeStream)
            .pipe(writeStream)

        const uploadedData = await uploadFinished

        console.log('Data: ', {
            ...uploadedData, 
            BucketEndpoint: URL,
            ImageURL: image_location
        })

        return {
            statusCode: 200,
            headers: {
                // 'location': image_location,
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            
            body: image_location.toString()
        }

    } catch (err) {
        console.error(err)
        return {
            statusCode: '500',
            body: '' + err.message
        }
    }
 
} 