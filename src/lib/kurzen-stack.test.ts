import * as cdk from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { KurzenStack } from './kurzen-stack'

const app = new cdk.App()
let templateFromStack: cdk.assertions.Template
beforeAll(() => {
  const stack = new KurzenStack(app, 'MyTestStack', {})
  templateFromStack = Template.fromStack(stack)
})

describe('Testing Kurzen stack resources', () => {
  test('Redirect function is set', () => {
    templateFromStack.hasResource('AWS::Lambda::Function', {
      Properties: {
        Handler: 'redirect.handler',
        MemorySize: 1024,
      },
    })
  })

  test('Redict function url is set', () => {
    templateFromStack.hasResource('AWS::Lambda::Url', {
      Properties: {
        AuthType: 'NONE',
      },
    })
  })

  test('CloudFormation distribution is set', () => {
    templateFromStack.hasResource('AWS::CloudFront::Distribution', {})
  })
})
