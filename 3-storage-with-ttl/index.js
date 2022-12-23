const config = require('./config');
const RedisClient = require('./redis/client')(config.redis.host, config.redis.port);

const CONFIRM_CODE_PREFIX = 'confirm_email';
const MAX_USERS_COUNT = 10;
const CODE_VALID_TIME = 120;

(async () => {
  const redisClient = await RedisClient(config.redis.clients.main.db);

  for (let userId = 1; userId <= MAX_USERS_COUNT; userId++) {
    const confirmationCode = Math.floor(Math.random() * 99999);

    await redisClient.set(
      `${CONFIRM_CODE_PREFIX}:${userId}`,
      confirmationCode,
      {
        EX: CODE_VALID_TIME,
      },
    );
  }

  await redisClient.quit();
})();