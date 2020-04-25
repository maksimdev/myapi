const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.updateShoppingItem = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const { name, category, amount, status } = JSON.parse(event.body);
  const user = JSON.parse(event.requestContext.authorizer.user);
  if (!id) return callback(null, utils.convertToRespose(500, 'Error: Id is empty'));
  
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(500, err))
    }
    client.query(
      `UPDATE shopping_items SET "name" = $2, "category" = $3, "amount" = $4, "status" = $5 WHERE "id" = $1 RETURNING *;`,
      [id, name, category, amount, status], (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(500, err))
      }
      callback(null, utils.convertToRespose(200, result.rows[0]));
    })
  });
};