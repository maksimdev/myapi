const { Pool } = require('pg');
const config = require('./config.json');
const utils = require('./utils');

const pool = new Pool(config);

module.exports.getUsers = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query('SELECT * from users', (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows))
    })
  });
};