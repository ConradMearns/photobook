import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');
import s3 = require('@aws-cdk/aws-s3');
import s3deploy = require('@aws-cdk/aws-s3-deployment')
import { Duration, CfnOutput } from '@aws-cdk/core';

export class PhotobookStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3
    const originBucket = s3.Bucket.fromBucketName(this, 'OriginBucket', 'photos.ronc');
    const publicBucket = s3.Bucket.fromBucketName(this, 'PublicBucket', 'public.ronc');

    const destBucket = new s3.Bucket(this, 'DestinationBucket');

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [ s3deploy.Source.asset('./web/public') ],
      destinationBucket: publicBucket
    });

    new s3deploy.BucketDeployment(this, 'DeployImages', {
      sources: [],
      destinationBucket: destBucket,
    });

    new CfnOutput(this, 'PublicBucketURL', {value: destBucket.bucketWebsiteUrl});

    // Lambdas
    const list_objects_python = new lambda.Function(this, 'ListObjectsPython', {
      code: lambda.Code.fromAsset('lambda/list_objects_python'),
      handler: 'list.handler',
      runtime: lambda.Runtime.PYTHON_3_7,
      timeout: Duration.seconds(20),
      environment: {
        originBucketName: originBucket.bucketName
      }
    });

    const get_image = new lambda.Function(this, 'GetImage', { 
      code: lambda.Code.asset('lambda/get_image'), 
      handler: 'index.handler', 
      runtime: lambda.Runtime.NODEJS_10_X, 
      timeout: Duration.seconds(200),
      memorySize: 3008,
      environment: {
        ORIGIN_BUCKET_NAME: originBucket.bucketName,
        DESTINATION_BUCKET_NAME: destBucket.bucketName,
        DESTINATION_BUCKET_URL: destBucket.bucketWebsiteUrl
      } 
    }); 

    // API Gateway
    new apigw.LambdaRestApi(this, 'ListObjectsApi', {
      handler: list_objects_python
    });
    new apigw.LambdaRestApi(this, 'GetImageApi', { 
      handler: get_image,
      //binaryMediaTypes: ["image/jpeg"]
    }); 

    originBucket.grantRead(list_objects_python);
    originBucket.grantReadWrite(get_image);

    destBucket.grantReadWrite(get_image);
    destBucket.grantPublicAccess();


    // const list_objects_node = new lambda.Function(this, 'ListObjectsNode', {
    //   code: lambda.Code.fromAsset('lambda/list_objects_node'),
    //   handler: 'index.handler',
    //   runtime: lambda.Runtime.NODEJS_10_X,
    //   environment: {
    //     originBucketName: originBucket.bucketName
    //   }
    // });

    // new apigw.LambdaRestApi(this, 'NodeApi', {
    //   handler: list_objects_node
    // });

    // originBucket.grantRead(list_objects_node);

  }
}
