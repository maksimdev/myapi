const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);
//можно записывать в чужие листы!
module.exports.deleteShoppingItem = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const user = JSON.parse(event.requestContext.authorizer.user);
  if(!id) return callback(null, utils.convertToRespose('Error: Id is empty', 500));
  
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      `DELETE FROM shopping_items where "id" = $1 RETURNING *;`,
      [id],
      (err, result) => {
        release()
        if (err) {
          return callback(null, utils.convertToRespose(err, 500));
        }
        callback(null, utils.convertToRespose(result.rows[0]));
      })
  });
};