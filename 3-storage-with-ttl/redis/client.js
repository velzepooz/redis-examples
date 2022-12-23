const redis = require('redis');

module.exports = (host, port) => async (db) => {
  const client = redis.createClient({
    socket: {
      host,
      port,
    },
    database: db,
  });

  await client.connect();

  return client;
}