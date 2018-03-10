const bluebird = require("bluebird");
const redis = require("redis");
const redisClient = redis.createClient();
const UserData = require('./user_data.json');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const getById = async (id) => {
    // 1. check redis for user

    // 2. check store for user
    const user = UserData.filter(user => {
        return user.id === parseInt(id);
    });

    try {
     // 3. cache user in redis or return {}
    const jsonUser = JSON.stringify(user);
    let redisUserCache;
    redisUserCache = await redisClient.rpush("users", jsonUser);
    } catch (error) {
        console.log(error);
    }

    return user;
};

// return redis cache [limit 20]
const getHistory = async () => {
    let cachedUsers;
    try {
        cachedUsers = await redisClient.lrangeAsync("users", 0, 19);
        cachedUsers = JSON.parse(cachedUsers);
    } catch (error) {
        console.log(error);
    }

    return cachedUsers;
};

module.exports = {
    getById : getById,
    getHistory : getHistory
}
