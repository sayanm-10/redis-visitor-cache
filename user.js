const bluebird = require("bluebird");
const redis = require("redis");
const redisClient = redis.createClient();
const UserData = require('./user_data.json');

const getById = (id) => {
    // 1. check redis for user

    // 2. check store for user

    // 3. cache user in redis or return {}
    const user = UserData.filter(user => {
        return user.id === parseInt(id);
    });

    return user;
};

const getHistory = () => {
    // return redis cache [limit 20]
};

module.exports = {
    getById : getById,
    getHistory : getHistory
}
