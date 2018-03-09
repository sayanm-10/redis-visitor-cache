const bluebird = require("bluebird");
const redis = require("redis");
const redisClient = redis.createClient();
const UserData = require('./user_data.json');

const getUserById = (id) => {

};

const getHistory = () => {

};

module.exports = {
    getUserById : getUserById,
    getHistory : getHistory
}
