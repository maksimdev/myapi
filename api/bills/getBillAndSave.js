'use strict';

const axios = require('axios');
const utils = require('../../lib/utils');
const { Pool } = require('pg');
const config = require('./../../config.json');

const pool = new Pool(config);

module.exports.getBillAndSave = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { fn, fd, fp } = event.queryStringParameters;
  const DERVICEID='curl';
  const DEVICEOS='linux';
  const PHONE='+79312118796';
  const PASS='904583';
  const url = `https://${PHONE}:${PASS}@proverkacheka.nalog.ru:9999/v1/inns/*/kkts/*/fss/${fn}/tickets/${fd}?fiscalSign=${fp}&sendToEmail=no`;
  const res = await axios.get(url, { headers: {
    'Device-Id': DERVICEID,
    'Device-OS': DEVICEOS
  }})
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
  } = res.data.document.receipt;
  const { items } = res.data.document.receipt;

  if (!res.data) return callback(null, utils.convertToRespose(500, { type: 'PROVERKACHEKA', message: `${res.message}` }));

  const client = await pool.connect();
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
      0
    ]
  );

  const values = items.map(({ quantity, sum, name, price}) => `(${resultReceipt.rows[0].id}, ${quantity}, ${sum}, '${name}', ${price})`);

  const query = `INSERT INTO public.goods ("receiptid", "quantity", "sum", "name", "price") VALUES ${values.join(', ')};`
  const resultItems = await client.query(query);

  client.release()

  callback(null, utils.convertToRespose(200, { type: 'SYSTEM', message: `${resultReceipt.rowCount}:${resultItems.rowCount}` }));
};