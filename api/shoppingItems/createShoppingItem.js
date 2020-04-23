const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

//можно записывать в чужие листы!
module.exports.createShoppingItem = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { name, category, amount, status, listId } = JSON.parse(event.body);
  const user = JSON.parse(event.requestContext.authorizer.user);
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      `
        INSERT INTO shopping_items ("name", "category", "amount", "status", "shoppinglistid")
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;`,
      [name, category, amount, status, listId],
      (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};