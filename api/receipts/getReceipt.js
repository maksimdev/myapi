const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getReceipt = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const user = JSON.parse(event.requestContext.authorizer.user);
  let resultReceiptRequest = [];
  let resultReceipt = [];
  let resultGoods = [];

  const client = await pool.connect();
  resultReceiptRequest = await client.query(
    `SELECT * FROM public.receipts_requests where "id" = $1 and "userid" = $2;`,
    [event.pathParameters.id, user.id]
  );

  if (resultReceiptRequest.rows.length) {
    const { fiscaldocumentnumber, fiscalsign, fiscaldrivenumber } = resultReceiptRequest.rows[0];
    resultReceipt = await client.query(
      `SELECT * FROM public.receipts where "userid" = $1 and "fiscaldocumentnumber" = $2 and "fiscalsign" = $3 and "fiscaldrivenumber" = $4;`,
      [user.id, fiscaldocumentnumber, fiscalsign, fiscaldrivenumber]
    );
    if (resultReceipt.rows.length) {
      resultGoods = await client.query(
        `SELECT * FROM public.goods where "receiptid" = $1;`,
        [resultReceipt.rows[0].id]
      );
    }
  }

  client.release();

  callback(null, utils.convertToRespose(200, { receipt: resultReceipt.rows[0], items: resultGoods.rows }));
};