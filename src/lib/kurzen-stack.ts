import {
  Duration,
  Fn,
  Stack,
  StackProps,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
} from 'aws-cdk-lib'
import path from 'path'
import { Construct } from 'constructs'

export class KurzenStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // database for the links
    new dynamodb.Table(this, 'cacheTable', {
      partitionKey: { name: 'Slug', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })

    // redirect lambda function
    const redirectFunction = new lambda.Function(this, 'redirectFunction', {
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambdas/')),
      functionName: 'redirect',
      handler: 'redirect.handler',
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: Duration.seconds(5),
    })

    // redirect lambda function url
    const redirectFunctionUrl = redirectFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    })

    // cloudformation distribution
    new cloudfront.Distribution(this, 'CloudFrontDistribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(
          Fn.select(2, Fn.split('/', redirectFunctionUrl.url))
        ),
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      logIncludesCookies: false,
      enabled: true,
    })
  }
}
