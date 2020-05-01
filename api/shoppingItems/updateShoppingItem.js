const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.updateShoppingItem = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const body = JSON.parse(event.body);
  const user = JSON.parse(event.requestContext.authorizer.user);
  if (!id) return callback(null, utils.convertToRespose(500, 'Error: Id is empty'));
  let queryFields = Object.keys(body).map((i, j) => (i + ` = $${j + 2}`)).join(', ');
  let values = Object.keys(body).map((key) => body[key]) || [];
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(500, err))
    }
    client.query(
      `UPDATE shopping_items SET ${queryFields} WHERE "id" = $1 RETURNING *;`,
      [id, ...values], (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(500, err))
      }
      callback(null, utils.convertToRespose(200, result.rows[0]));
    })
  });
};