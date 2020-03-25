const { Pool } = require('pg');
const config = require('./config.json');

const pool = new Pool(config);

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT * from users', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log(result.rows);

    process.exit();
  })
})