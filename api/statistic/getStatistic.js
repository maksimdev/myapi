const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getStatistic = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const user = JSON.parse(event.requestContext.authorizer.user);
  const { year, month } = event.queryStringParameters;

  let statisticResult = [];
  let billRequestsResult = [];

  const client = await pool.connect();
  // statisticResult = await client.query(
  //   `SELECT * FROM public.receipts_requests where "id" = $1 and "userid" = $2;`,
  //   [event.pathParameters.id, user.id]
  // );

  billRequestsResult = await client.query(
    `select * from public.receipts_requests as rr where EXTRACT(YEAR FROM datetime) = $1 and EXTRACT(MONTH FROM datetime) = $2 and "userid" = $3;`,
    [year, month, user.id]
  );
  
  client.release();

  callback(null, utils.convertToRespose(200, {
    billRequests: billRequestsResult.rows,
    statistic: []
  }));
};