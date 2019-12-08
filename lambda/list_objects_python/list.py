import os
import boto3
import json

def handler(event, context):
    client = boto3.client('s3')

    resp = client.list_objects_v2(
        Bucket= os.getenv('originBucketName', 'BUCKETNAME')
    )
    
    return { 
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": True,
            'Content-Type': 'text/plain'
        },
        'body': json.dumps(resp, default=str, indent=2) + '\n'
    }

    