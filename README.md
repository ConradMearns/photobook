# photobook

Just testing things with AWS CDK. This stack contains some Lambdas, API Gateway endpoints, and Buckets. One of the buckets includes an entire Svelte project to serve as a static endpoint. The goal is to have a single project that, when deployed, can store a large number of images and let them be shared with friends and family without much hassle.

## Lambda
I used (this post)[https://dev.to/adnanrahic/a-crash-course-on-serverless-with-aws---image-resize-on-the-fly-with-lambda-and-s3-4foo] to quickly get an image resizer set up. Just know that you will have the best luck of doing so when deploying from a *nix based machine - WSL has been working okay for me so far. This lambda is saved under `lambda/get_image` and uses the Node 10 runtime.

The two other lambdas do effectively the same thing - list objects in S3 - but one is in Node and the other is in Python 3.

# Needs
 - Reduce S3 API calls
 - Svelte app needs flexible way of acquiring API endpoints
 - Handle MOV files
 - Images are clickable-launch modal
 - Lock down S3 to only this app
 - Authentication

# Wants
 - Rust lambdas?