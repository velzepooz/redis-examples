const config = require('./config');
const RedisClient = require('./redis/client')(config.redis.host, config.redis.port);

const GAME_SETTINGS_PREFIX = 'game_settings';
const MAX_USERS_COUNT = 10;

(async () => {
  const redisClient = await RedisClient(config.redis.clients.main.db);

  for (let userId = 1; userId <= MAX_USERS_COUNT; userId++) {
    const maxPlayers = 1;
    const speed = Math.floor(Math.random() * 999);

    await redisClient.hSet(
      `${GAME_SETTINGS_PREFIX}:${userId}`,
      { speed, theme: userId, maxPlayers },
    );
  }

  for (let userId = MAX_USERS_COUNT; userId > 0; userId--) {
    const settings = await redisClient.hGetAll(
      `${GAME_SETTINGS_PREFIX}:${userId}`,
    );

    const maxPlayers = await redisClient.hGet(`${GAME_SETTINGS_PREFIX}:${userId}`, 'maxPlayers');

    console.log(
      `User id: ${userId}. User speed: ${settings.speed}, theme: ${settings.theme}.`
    );
    console.log(`Max players: ${maxPlayers}`);
  }

  await redisClient.quit();
})();