const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.createUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { username } = JSON.parse(event.body);
  if(!username) return callback(null, utils.convertToRespose('Error: props are invalid', 500));

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query(
      'INSERT INTO users (username) VALUES($1) RETURNING *;',
      [username],
      (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};