const config = require('./config');
const RedisClient = require('./redis/client')(config.redis.host, config.redis.port);
const { STATUS_CHANGED } = require('./redis/redis-prefix.constant');

const EXPIRED_SUBSCRIBE_KEY = `__keyevent@${config.redis.clients.main.db}__:expired`;

const subscribeActions = {
  [STATUS_CHANGED]([userId, status]) {
    console.log(`[Subscriber]: Status for user ${userId} changed to ${status}`);
  }
};

(async () => {
  const redisSubscriber = await RedisClient(config.redis.clients.main.db);

  redisSubscriber.configSet('notify-keyspace-events', 'Ex');

  await redisSubscriber.subscribe(EXPIRED_SUBSCRIBE_KEY, async (message, channel) => {
    console.log({message})
    console.log({channel})
    const [action, ...args] = message.split(':');

    subscribeActions[action](args);
    await redisSubscriber.quit();
  });
})();