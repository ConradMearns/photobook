#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { PhotobookStack } from '../lib/photobook-stack';

const app = new cdk.App();
new PhotobookStack(app, 'PhotobookStack');
