const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.createReceiptRequest = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const user = JSON.parse(event.requestContext.authorizer.user);
  const { dateTime, totalSum, fiscalDocumentNumber, fiscalSign, fiscalDriveNumber } = JSON.parse(event.body);
  if (!dateTime || !totalSum || !fiscalDocumentNumber || !fiscalSign || !fiscalDriveNumber) return callback(null, utils.convertToRespose('Error: props are invalid', 500));

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      `
        INSERT INTO public.receipts_requests (fiscaldocumentnumber, totalsum, fiscalsign, datetime, fiscaldrivenumber, userid, status)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, fiscaldocumentnumber, totalsum, fiscalsign, datetime, fiscaldrivenumber, userid, status;`,
      [fiscalDocumentNumber, totalSum, fiscalSign, dateTime, fiscalDriveNumber, user.id, 'pending'],
      (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};