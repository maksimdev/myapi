const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.deleteShoppingList = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const user = event.requestContext.authorizer.claims.user;
  if(!id) return callback(null, utils.convertToRespose('Error: Id is empty', 500));
  
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      `DELETE FROM shopping_lists where "id" = $1 and "userid" = $2 RETURNING "id", "title", "status", "created_at", "updated_at";`,
      [id, user.id],
      (err, result) => {
        release()
        if (err) {
          return callback(null, utils.convertToRespose(err, 500));
        }
        callback(null, utils.convertToRespose(result.rows[0]));
      })
  });
};