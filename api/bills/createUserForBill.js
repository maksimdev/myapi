'use strict';

const axios = require('axios');
const utils = require('../../lib/utils');

module.exports.createUserForBill = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { phone, email, name } = JSON.parse(event.body);

  if(!phone || !email || !name) return callback(null, utils.convertToRespose(500, 'Error: props are invalid'));

  const contentType = 'application/json; charset=UTF-8';
  const body = JSON.stringify({ phone, email, name });
  const url = `https://proverkacheka.nalog.ru:9999/v1/mobile/users/signup`;
  const res = await axios.post(url, {
    headers: {
      'Content-Type': contentType
    },
    body
  });

  callback(null, utils.convertToRespose(200, res.data));
}