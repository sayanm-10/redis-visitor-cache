const bluebird = require("bluebird");
const redis = require("redis");
const flat = require("flat");
const unflatten = flat.unflatten;
const redisClient = redis.createClient();
const UserData = require('./user_data.json');
const MAX_CACHE_LENGTH = 20;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// find user in redis store by id
const searchRedisForUser = async(id) => {
    let userInStore;
    const pattern = `*\\\"id\\\":${id}*`;

    try {
         await redisClient.scan("users", 0, 'MATCH', pattern, (result) => {
            userInStore = result;
        });
    } catch (error) {
        console.log("Error looking for user in Redis store");
    }

    return userInStore;
};

const getById = async (id) => {
    let user;
    
    try {
        // check redis for user
        user = await searchRedisForUser(id);
        // check store for user
        if (!user) {
            user = UserData.filter(user => {
                return user.id === parseInt(id);
            });
        }

        // cache user in redis
        if(typeof user !== "undefined" && user.length > 0) {
            const jsonUser = JSON.stringify(user);
            let redisUserCache = await redisClient.lpushAsync("users", jsonUser);
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
        cachedUsers = await redisClient.lrangeAsync("users", 0, MAX_CACHE_LENGTH - 1);
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
