'use strict';

const axios = require('axios');
const utils = require('../../lib/utils');

module.exports.getBill = async (event, context, callback) => {
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
  }});

  callback(null, utils.convertToRespose(res.data));
}