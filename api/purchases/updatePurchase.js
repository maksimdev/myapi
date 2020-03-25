const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.updatePurchase = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const { category_id, cost, date, comment } = JSON.parse(event.body);
  if(!id) return callback(null, utils.convertToRespose('Error: Id is empty', 500));
  if(!category_id, !cost, !date) return callback(null, utils.convertToRespose('Error: props are invalid', 500));
  
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      `UPDATE purchases SET "category_id" = $2, "cost" = $3, "date" = $4, "comment" = $5, "updated_at" = now() WHERE "id" = $1 RETURNING "id", "category_id", "cost", to_char("date", 'YYYY-MM-DD') as "date", "created_at", "updated_at";`,
      [id, category_id, cost, date, comment], (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};