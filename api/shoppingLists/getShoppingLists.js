const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getShoppingLists = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const user = JSON.parse(event.requestContext.authorizer.user);
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(500, err));
    }
    client.query(`SELECT "id", "title", "status", "created_at", "updated_at" from shopping_lists where "userid" = $1;`,
    [user.id],
    (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(500, err));
      }
      callback(null, utils.convertToRespose(200, result.rows));
    })
  });
};