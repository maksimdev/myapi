const _ = require('lodash');

const convertToRespose = (statusCode, body) => ({
  "statusCode": statusCode,
  "headers": {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*"
  },
  ...(body ? {"body": JSON.stringify(body)} : {})
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
  const path = methodArn.split('/')[3];
  const hasValidScope = _.some(
    userScopes,
    scope => scope === path
  );
  return hasValidScope;
};

module.exports = {
  authorizeUser,
  convertToRespose,
  generatePolicy
}