const bluebird = require("bluebird");
const redis = require("redis");
const flat = require("flat");
const unflatten = flat.unflatten;
const redisClient = redis.createClient();
const UserData = require('./user_data.json');
const MAX_CACHE_LENGTH = 20;

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
            const cacheLength = await redisClient.llenAsync("users");
            
            if (cacheLength > MAX_CACHE_LENGTH - 1) { // limit redis cache size 
                await redisClient.lpopAsync("users"); // removes first entry in list
            }
            
            const jsonUser = JSON.stringify(user);
            let redisUserCache = await redisClient.rpush("users", jsonUser);
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
    }

    return cachedUsers;
};

module.exports = {
    getById : getById,
    getHistory : getHistory
}
