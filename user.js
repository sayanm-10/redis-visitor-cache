const bluebird = require("bluebird");
const redis = require("redis");
const flat = require("flat");
const unflatten = flat.unflatten;
const redisClient = redis.createClient();
const UserData = require('./user_data.json');
const MAX_CACHE_LENGTH = 20;
let user_rank = 0;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const getById = async (id) => {
    // check redis for user
    let user;
    
    try {
        // check store for user
        user = UserData.filter(user => {
            return user.id === parseInt(id);
        });

        // cache user in redis or return {}
        if(typeof user !== "undefined" && user.length > 0) {
            const jsonUser = JSON.stringify(user);
            user_rank = user_rank + 1;
            let redisUserCache = await redisClient.zadd("users", user_rank, jsonUser); // adding asynchronously messes rank
        }
    } catch (error) {
        console.log(error);
    }

    return user;
};

// return redis cache [limit 20]
const getHistory = async () => {
    let cachedUsers;

    try {
        let redisCacheSize = await redisClient.zcountAsync("users", "-inf", "+inf");
        // fetch 20 top ranked itemss
        cachedUsers = await redisClient.zrevrangebyscoreAsync("users", redisCacheSize, redisCacheSize - MAX_CACHE_LENGTH + 1);
    } catch (error) {
        console.log(error);
        throw error;
    }

    return cachedUsers;
};

module.exports = {
    getById : getById,
    getHistory : getHistory
}
