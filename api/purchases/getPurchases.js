const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getPurchases = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const date = event.queryStringParameters && event.queryStringParameters.date;
  const from = event.queryStringParameters && event.queryStringParameters.from;
  const to = event.queryStringParameters && event.queryStringParameters.to;

  const splitedCurrentDate = (new Date()).toISOString().split('-');
  const currentYearAndMonth = splitedCurrentDate[0] + '-' + splitedCurrentDate[1];
  
  const byCurrentMonth = `text("date") ilike '${currentYearAndMonth}%';`;
  const byFromTo = `"date" > '${from}' and "date" < '${to}';`;
  const byDate = `text("date") ilike '${date}%';`;

  let mainCondition = byCurrentMonth;
  if (from && to) mainCondition = byFromTo;
  if (date) mainCondition = byDate;

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500));
    }
    client.query(`SELECT "id", "category_id", "cost", to_char("date", 'YYYY-MM-DD') as "date", "created_at", "updated_at" from purchases where ${mainCondition};`, (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500));
      }
      callback(null, utils.convertToRespose(result.rows));
    })
  });
};