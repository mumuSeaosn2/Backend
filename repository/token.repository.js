const model = require("../models");
const { promisify } = require('util');
const redisClient = require("../redis.js");
const client = require("../redis.js");

const Token = function(token) {
  this.userId = token.userId;
  this.refreshToken = token.refreshToken;
};

const asyncRedisGet = promisify(redisClient.get).bind(redisClient);
const asyncRedisDel = promisify(redisClient.del).bind(redisClient);
const asyncRedisLpop = promisify(redisClient.lPop).bind(redisClient);
const asyncRedisRpush = promisify(redisClient.rPush).bind(redisClient);

Token.findAllRefreshById = (id, results) => {
  redisClient.lRange(id,0,-1).then(result => {
    console.log(result)
    return results(null, result);
  })
  .catch(err => {
    console.log(err);
    return results(err, null);
  })
};

Token.removeOneRefresh = (id, results) => {
    redisClient.lPop(id).then(result => {
      console.log("delete oldest token");
      return results(null,result);
    })
    .catch(err => {
      console.log(err);
      return results(err, null);
    });
}

Token.createRefresh = (refreshToken, results) => {
    redisClient.rPush(refreshToken.userId,refreshToken.refreshToken).then(() => {
      console.log("insert token into redis");
      results(null, refreshToken)
      return;
    })
    .catch(err => {
      console.log(err);
      results(err,null);
      return;
    });
};

Token.removeRefresh = (id, results) => {
  redisClient.del(id)
  .then(result => {
    console.log("delete all tokens");
    return results(null,"done");
  })
  .catch(err => {
    console.log(err);
    return results(err, null);
  })
}

module.exports = Token;