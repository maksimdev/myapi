const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.updateUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const { username } = JSON.parse(event.body);
  if(!id) return callback(null, utils.convertToRespose('Error: Id is empty', 500));
  if(!username) return callback(null, utils.convertToRespose('Error: props are invalid', 500));
  
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query('UPDATE users SET "username" = $2 WHERE "id" = $1 RETURNING *;', [id, username], (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};