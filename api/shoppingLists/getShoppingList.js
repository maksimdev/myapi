const { Pool } = require('pg');
const config = require('./../../config.json');
const utils = require('../../lib/utils');

const pool = new Pool(config);

module.exports.getShoppingList = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const id = event.queryStringParameters && event.queryStringParameters.id;
  const user = JSON.parse(event.requestContext.authorizer.user);
  if(!id) return callback(null, utils.convertToRespose(500, 'Error: Id is empty'));

  const client = await pool.connect();
  const shoppingList = await client.query(
    `SELECT "id", "title", "status", "created_at", "updated_at" from shopping_lists where "id" = $1 and "userid" = $2 limit 1;`,
    [id, user.id],
  );
  const shoppingListItems = await client.query(
    `SELECT id, "name", category, amount, status FROM public.shopping_items WHERE "shoppinglistid" = $1;`,
    [id],
  );
  client.release();

  if(!shoppingList.rows[0]) return callback(null, utils.convertToRespose(404));

  callback(null, utils.convertToRespose(200, {
    ...shoppingList.rows[0],
    items: shoppingListItems.rows
  }));
};