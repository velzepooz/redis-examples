const config = require('./config');
const RedisClient = require('./redis/client')(config.redis.host, config.redis.port);

const STATUS_CHANGED = 'status_changed';

(async () => {
  const redisClient = await RedisClient(config.redis.clients.main.db);
  const userId = Math.floor(Math.random() * 99999);
  const userStatus = 'active';
  const statusChangeInSeconds = 5;

  await redisClient.set(
    `${STATUS_CHANGED}:${userId}:${userStatus}`,
    '',
    {
      EX: statusChangeInSeconds,
    },
  );

  console.log('[Publisher]: Status change set');

  await redisClient.quit();
})();