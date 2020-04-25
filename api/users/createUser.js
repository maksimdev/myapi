const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.createUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { username } = JSON.parse(event.body);
  if(!username) return callback(null, utils.convertToRespose(500, 'Error: props are invalid'));

  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(500, err))
    }
    client.query(
      'INSERT INTO users (username) VALUES($1) RETURNING *;',
      [username],
      (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(500, err))
      }
      callback(null, utils.convertToRespose(200, result.rows[0]));
    })
  });
};