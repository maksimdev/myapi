const _ = require('lodash');

const convertToRespose = (body, status) => ({
  "statusCode": status || 200,
  "headers": {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  "body": JSON.stringify(body)
});

const generatePolicy = function(principalId, effect, resource, context) {
  const authResponse = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }]
    },
    context
  };
  return authResponse;
}

const authorizeUser = (userScopes, methodArn) => {
  const path = methodArn.split('T/')[1];
  const hasValidScope = _.some(
    userScopes,
    scope => _.endsWith(methodArn, scope) || path.match(new RegExp(`^${scope}/(\\d+)$`)));
  return hasValidScope;
};

module.exports = {
  authorizeUser,
  convertToRespose,
  generatePolicy
}