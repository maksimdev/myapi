const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  if(!id) return callback(null, utils.convertToRespose(500, 'Error: Id is empty'));

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(500, err))
    }
    client.query('SELECT * from users where "id" = $1;', [id], (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(500, err));
      }
      callback(null, utils.convertToRespose(200, result.rows[0]));
    })
  });
};