const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.updateCategory = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const { title } = JSON.parse(event.body);
  if(!id) return callback(null, utils.convertToRespose('Error: Id is empty', 500));
  if(!title) return callback(null, utils.convertToRespose('Error: props are invalid', 500));
  
  pool.connect((err, client, release) => {
    if (err) {
      return callback(null, utils.convertToRespose(err, 500))
    }
    client.query('UPDATE categories SET "title" = $2 WHERE "id" = $1 RETURNING *;', [id, title], (err, result) => {
      release()
      if (err) {
        return callback(null, utils.convertToRespose(err, 500))
      }
      callback(null, utils.convertToRespose(result.rows[0]));
    })
  });
};