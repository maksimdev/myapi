const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getShoppingList = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const user = JSON.parse(event.requestContext.authorizer.user);
  if(!id) return callback(null, utils.convertToRespose('Error: Id is empty', 500));

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(`SELECT "id", "title", "status", "created_at", "updated_at" from shopping_lists where "id" = $1 and "userid" = $2 limit 1;`,
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