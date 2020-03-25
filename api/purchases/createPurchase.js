const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.createPurchase = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { category_id, cost, date, comment } = JSON.parse(event.body);
  if(!category_id || !cost || !date) return callback(null, utils.convertToRespose('Error: props are invalid', 500));

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      `
        INSERT INTO purchases ("category_id", "cost", "date", "created_at", "updated_at", "comment")
        VALUES($1, $2, $3, now(), now(), $4)
        RETURNING "id", "category_id", "cost", to_char("date", 'YYYY-MM-DD') as "date", "created_at", "updated_at";`,
      [category_id, cost, date, comment],
      (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};