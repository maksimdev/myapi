const jwt = require('jsonwebtoken');
const utils = require('../lib/utils');

module.exports.authorize = function(event, context, callback) {
  try {
    const token = event.authorizationToken.slice(7);
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    const authorizerContext = { user: JSON.stringify(user) };
    const isAllowed = utils.authorizeUser(user.scopes, event.methodArn);
    if (isAllowed) {
      callback(null, utils.generatePolicy('user', 'Allow', '*', authorizerContext));
    } else {
      callback(null, utils.generatePolicy('user', 'Deny', event.methodArn, authorizerContext));
    }
  } catch (e) {
    callback(`Unauthorized`);
  }
};