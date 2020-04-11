const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getReceipts = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const user = JSON.parse(event.requestContext.authorizer.user);

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500));
    }
    client.query(
      `SELECT id, fiscaldocumentnumber, totalsum, fiscalsign, datetime, fiscaldrivenumber, userid, status, created_at FROM public.receipts_requests WHERE userid = $1;`,
    [user.id],
    (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500));
      }
      callback(null, utils.convertToRespose(result.rows));
    })
  });
};