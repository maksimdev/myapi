const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getReceipt = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const user = JSON.parse(event.requestContext.authorizer.user);
  console.log('event:', event);
  console.log('event.pathParameters:', event.pathParameters);
  console.log('event.pathParameters.id:', event.pathParameters.id);
  console.log(`userId: `, user.id);
  let resultReceiptRequest = [];
  let resultReceipt = [];
  let resultGoods = [];

  const client = await pool.connect();
  resultReceiptRequest = await client.query(
    `SELECT * FROM public.receipts_requests where "id" = $1 and "userid" = $2;`,
    [event.pathParameters.id, user.id]
  );
  console.log('resultReceiptRequest.rows:', resultReceiptRequest.rows);

  if (resultReceiptRequest.rows.length) {
    const { fiscaldocumentnumber, fiscalsign, fiscaldrivenumber } = resultReceiptRequest.rows[0];
    console.log('fiscaldocumentnumber, fiscalsign, fiscaldrivenumber: ', fiscaldocumentnumber, fiscalsign, fiscaldrivenumber);

    resultReceipt = await client.query(
      `SELECT * FROM public.receipts where "userid" = $1 and "fiscaldocumentnumber" = $2 and "fiscalsign" = $3 and "fiscaldrivenumber" = $4;`,
      [user.id, fiscaldocumentnumber, fiscalsign, fiscaldrivenumber]
    );
    console.log('resultReceipt.rows: ', resultReceipt.rows);

    if (resultReceipt.rows.length) {
      resultGoods = await client.query(
        `SELECT * FROM public.goods where "receiptid" = $1;`,
        [resultReceipt.rows[0].id]
      );
    }
    console.log('resultGoods: ', resultGoods);

  }

  client.release();

  callback(null, utils.convertToRespose({ receipt: resultReceipt.rows[0], items: resultGoods.rows }));
};