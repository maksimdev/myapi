const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.updateShoppingItem = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const { name, category, amount, status } = JSON.parse(event.body);
  const user = event.requestContext.authorizer.claims.user;
  if (!id) return callback(null, utils.convertToRespose('Error: Id is empty', 500));
  
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      `UPDATE shopping_items SET "name" = $2, "category" = $3, "amount" = $4, "status" = $5 WHERE "id" = $1 RETURNING *;`,
      [id, name, category, amount, status], (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};