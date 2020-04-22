const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.updateShoppingList = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const { title, status } = JSON.parse(event.body);
  const user = event.requestContext.authorizer.claims.user;
  if (!id) return callback(null, utils.convertToRespose('Error: Id is empty', 500));
  if (!title) return callback(null, utils.convertToRespose('Error: props are invalid', 500));
  
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      `UPDATE shopping_lists SET "title" = $2, "status" = $3, "updated_at" = now() WHERE "id" = $1 and "userid" = $4 RETURNING *;`,
      [id ,title, status, user.id], (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};