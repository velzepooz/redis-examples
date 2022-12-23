const config = require('./config');
const RedisClient = require('./redis/client')(config.redis.host, config.redis.port);

const CONFIRM_CODE_PREFIX = 'confirm_email';
const MAX_USERS_COUNT = 10;

(async () => {
  const redisClient = await RedisClient(config.redis.clients.main.db);

  for (let userId = 1; userId <= MAX_USERS_COUNT; userId++) {
    const confirmationCode = Math.floor(Math.random() * 99999);

    await redisClient.set(
      `${CONFIRM_CODE_PREFIX}:${userId}`,
      confirmationCode,
    );
  }

  for (let userId = MAX_USERS_COUNT; userId > 0; userId--) {
    const confirmationCode = await redisClient.get(
      `${CONFIRM_CODE_PREFIX}:${userId}`,
    );

    console.log(`User id: ${userId}. Confirmation code: ${confirmationCode}`);
  }

  await redisClient.quit();
})();