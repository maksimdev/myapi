// /functions/login.js
//вынести логику по получению пользователя и обернуть в трай кетч!
const config = require('./../config.json');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
//const users = require('../lib/users');
const utils = require('../lib/utils');

const pool = new Pool(config);
const JWT_EXPIRATION_TIME = '5m';

/**
  * POST /sessions
  *
  * Returns a JWT, given a username and password.
  * @method login
  * @param {String} event.body.username
  * @param {String} event.body.password
  * @throws Returns 401 if the user is not found or password is invalid.
  * @returns {Object} jwt that expires in 5 mins
  */
module.exports.login = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const { username, password } = JSON.parse(event.body);

  if(!username) return callback(null, utils.convertToRespose('Error: username is empty', 500));
  if(!password) return callback(null, utils.convertToRespose('Error: password is empty', 500));

  const client = await pool.connect();
  const result = await client.query(
    'SELECT "id", "scopes" FROM users WHERE "username"=$1 AND "password"=$2;',
    [username, password]
  );

  const user = result.rows[0];

  if(!user) return callback(null, utils.convertToRespose('Error: username or/and password is not valid', 404));

  //callback(null, utils.convertToRespose(result.rows[0]));

  try {
    // Authenticate user
    //const user = users.login(username, password); //checking user should be there

    // Issue JWT
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
    const response = { // Success response
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