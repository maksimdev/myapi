const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.createReceipt = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const user = JSON.parse(event.requestContext.authorizer.user);
  const data = JSON.parse(event.body);
  const receiptWasFound = data.receipt ? true : false;
  const request = receiptWasFound ? data.receipt : data;
  const client = await pool.connect();
  const resultReceiptsRequests = await client.query(
    `
      INSERT INTO public.receipts_requests (fiscaldocumentnumber, totalsum, fiscalsign, datetime, fiscaldrivenumber, userid, status)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, fiscaldocumentnumber, totalsum, fiscalsign, datetime, fiscaldrivenumber, userid, status;
    `,
    receiptWasFound
    ? [request.fiscalDocumentNumber, request.totalSum, request.fiscalSign, request.dateTime, request.fiscalDriveNumber, user.id, 'READY']
    : [request.fd, request.s, request.fp, request.t, request.fn, user.id, 'PENDING'],
  );

  if (receiptWasFound) {
    const {
      userInn,
      nds10,
      receiptCode,
      kktRegId,
      rawData,
      fiscalDocumentNumber,
      cashTotalSum,
      requestNumber,
      totalSum,
      shiftNumber,
      fiscalSign,
      operationType, 
      ecashTotalSum,
      dateTime,
      operator,
      taxationType,
      nds20,
      fiscalDriveNumber
    } = request;

    const resultReceipt = await client.query(
      'INSERT INTO public.receipts (userinn, nds10, receiptcode, kktregid, rawdata, fiscaldocumentnumber, cashtotalsum, requestnumber, totalsum, shiftnumber, fiscalsign, operationtype, ecashtotalsum, datetime, "operator", taxationtype, nds20, fiscaldrivenumber, userid) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING id;',
      [
        userInn,
        nds10,
        receiptCode,
        kktRegId,
        rawData,
        fiscalDocumentNumber,
        cashTotalSum,
        requestNumber,
        totalSum,
        shiftNumber,
        fiscalSign,
        operationType, 
        ecashTotalSum,
        dateTime,
        operator,
        taxationType,
        nds20,
        fiscalDriveNumber,
        user.id
      ]
    );

    const values = request.items.map(({ quantity, sum, name, price}) => `(${resultReceipt.rows[0].id}, ${quantity}, ${sum}, '${name}', ${price})`);
    const query = `INSERT INTO public.goods ("receiptid", "quantity", "sum", "name", "price") VALUES ${values.join(', ')};`
    const resultItems = await client.query(query);
  }

  client.release();

  callback(null, utils.convertToRespose({ type: 'SYSTEM', message: `ok` }, 200));
};