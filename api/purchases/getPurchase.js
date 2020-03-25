const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getPurchase = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if(!id) return callback(null, utils.convertToRespose('Error: Id is empty', 500));

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(`SELECT "id", "category_id", "cost", to_char("date", 'YYYY-MM-DD') as "date", "created_at", "updated_at" from purchases where "id" = $1;`, [id], (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500));
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};