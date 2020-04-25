const jwt = require('jsonwebtoken');
const utils = require('../lib/utils');

module.exports.authorize = function(event, context, callback) {
  try {
    const token = event.authorizationToken.slice(7);
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    const authorizerContext = { user: JSON.stringify(user) };
    console.log('user: ', user);
    console.log('event.methodArn: ', event.methodArn);
    const isAllowed = utils.authorizeUser(user.scopes, event.methodArn);
    if (isAllowed) {
      callback(null, utils.generatePolicy('user', 'Allow', '*', authorizerContext));
    } else {
      console.log('HERE1');
      callback(null, utils.generatePolicy('user', 'Deny', event.methodArn, authorizerContext));
    }
  } catch (e) {
    console.log('HERE2');
    callback(`Unauthorized`);
  }
};