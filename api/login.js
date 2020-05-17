const config = require('./../config.json');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const utils = require('../lib/utils');

const pool = new Pool(config);

module.exports.login = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { username, password } = JSON.parse(event.body);

  if(!username) return callback(null, utils.convertToRespose(500, 'Error: username is empty'));
  if(!password) return callback(null, utils.convertToRespose(500, 'Error: password is empty'));

  const client = await pool.connect();
  const result = await client.query(
    'SELECT "id", "scopes" FROM users WHERE "username"=$1 AND "password"=$2;',
    [username, password]
  );

  const user = result.rows[0];
  if(!user) return callback(null, utils.convertToRespose(401, 'Error: username or/and password is not valid'));

  try {

    const token = jwt.sign(
      { user, iat: Date.now(), exp: Date.now() + 86400000 },
      process.env.JWT_SECRET
    );
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token,
      }),
    };

    callback(null, response);
  } catch (e) {
    const response = {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: e.message,
      }),
    };
    callback(null, response);
  }
};