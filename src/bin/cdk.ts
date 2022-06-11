#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { KurzenStack } from '../lib/kurzen-stack'

const app = new cdk.App()
new KurzenStack(app, 'KurzenStack', {})

