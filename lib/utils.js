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
  var authResponse = {};
  
  authResponse.principalId = principalId;
  if (effect && resource) {
      var policyDocument = {};
      policyDocument.Version = '2012-10-17'; 
      policyDocument.Statement = [];
      var statementOne = {};
      statementOne.Action = 'execute-api:Invoke'; 
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
  }
  
  authResponse.context = context;
  return authResponse;
}

const authorizeUser = (userScopes, methodArn) => {
  const hasValidScope = _.some(userScopes, scope => _.endsWith(methodArn, scope));
  return hasValidScope;
};

module.exports = {
  authorizeUser,
  convertToRespose,
  generatePolicy
}