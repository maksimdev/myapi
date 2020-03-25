const jwt = require('jsonwebtoken');
const utils = require('../lib/utils');

module.exports.authorize = function(event, context, callback) {
  var token = 'allow'; //event.authorizationToken;

  switch (token) {
      case 'allow':
          callback(null, utils.generatePolicy('user', 'Allow', event.methodArn));
          break;
      case 'deny':
          callback(null, utils.generatePolicy('user', 'Deny', event.methodArn));
          break;
      case 'unauthorized':
          callback("Unauthorized");   // Return a 401 Unauthorized response
          break;
      default:
          callback("Error: Invalid token"); // Return a 500 Invalid token response
  }
};

//==========================================================
// const jwt = require('jsonwebtoken');
// const utils = require('../lib/utils');

// module.exports.authorize = (event, context, callback) => {
//   const token = event.authorizationToken;

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = decoded.user;

//     const authorizerContext = { user: JSON.stringify(user) };
//     const policyDocument = utils.buildIAMPolicy(user.id, 'Allow', event.methodArn, authorizerContext);

//     callback(null, policyDocument);
//   } catch (e) {
//     callback('Unauthorized');
//   }
// };