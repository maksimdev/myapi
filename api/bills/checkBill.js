'use strict';

const axios = require('axios');
const utils = require('../../lib/utils');

module.exports.checkBill = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { fn, fd, fp, time, sum } = event.queryStringParameters;
  if(!fn || !fd || !fp || !time || !sum) return callback(null, utils.convertToRespose(500, 'Error: props are invalid'));
  const url = `https://proverkacheka.nalog.ru:9999/v1/ofds/*/inns/*/fss/${fn}/operations/1/tickets/${fd}?fiscalSign=${fp}&date=${time}&sum=${sum}`;
  const res = await axios.get(url);

  callback(null, utils.convertToRespose(res.status));
}