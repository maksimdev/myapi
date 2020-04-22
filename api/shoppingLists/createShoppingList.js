const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.createShoppingList = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { title, status } = JSON.parse(event.body);
  const user = event.requestContext.authorizer.claims.user;
  if (!title) return callback(null, utils.convertToRespose('Error: props are invalid', 500));

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      `
        INSERT INTO shopping_lists ("title", "status", "userid", "created_at")
        VALUES($1, $2, $3, now())
        RETURNING "id", "title", "status", "created_at";`,
      [title, status, user.id],
      (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};