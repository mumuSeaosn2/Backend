const model = require("../models");
const { promisify } = require('util');
const redisClient = require("../redis.js")

const Token = function(token) {
  this.id = token.id;
  this.accessToken = token.accessToken;
};

const asyncRedisGet = promisify(redisClient.get).bind(redisClient);
const asyncRedisLpop = promisify(redisClient.lPop).bind(redisClient);
const asyncRedisRpush = promisify(redisClient.rPush).bind(redisClient);

Token.create = (newToken, results) => {
    model.Token.create({
      id : newToken.id,
      accessToken: newToken.accessToken,
    }).then(() => {
        console.log("insert token");
        results(null, newToken)
        return;
      })
      .catch(err => {
        console.log(err);
        results(err,null);
        return;
      });
};

Token.findById = (id, results) => {
  model.Token.findOne({
    raw: true,
    where: {id: id},
    attribute:['id','accessToken'],
  })
  .then(result => {
    return results(null, result);
  })
  .catch(err => {
    console.log(err);
    return results(err, null);
  })
};

Token.findAllById = (id, results) => {
  model.Token.findAll({
    raw: true,
    where: {id: id},
    attribute:['id', 'accessToken'],
  })
  .then(result => {
    return results(null, result);
  })
  .catch(err => {
    console.log(err);
    return results(err, null);
  })
};

Token.remove = async (id, accessToken, results) => {
  await model.Token.destroy({
    where: {id: id, accessToken: accessToken}
  })
  .then(result => {
    console.log("delete token");
    return results(null,"done");
  })
  .catch(err => {
    console.log(err);
    return results(err, null);
  })
}

Token.removeOne = (id, results) => {
  model.Token.findOne({
    raw: true,
    where: {id: id},
    attribute:['id','accessToken'],
    order: [['createdAt', 'DESC']],
  })
  .then(result => {
    model.Token.destroy({
      where: {id: result.id, accessToken: result.accessToken}
    })
    .catch(err => {
      console.log(err);
      return results(err, null);
    });
    console.log("delete oldest token");
    return results(null,"done");
  })
  .catch(err => {
    console.log(err);
    return results(err, null);
  })

}

Token.removeAll = (id, results) => {
  model.Token.destroy({
    where: {id: id},
  })
  .then(result => {
    console.log("delete all tokens");
    return results(null,"done");
  })
  .catch(err => {
    console.log(err);
    return results(err, null);
  })
}

Token.findAllRefreshById = (id, results) => {
  asyncRedisGet(id).then(result => {
    return results(null, result);
  })
  .catch(err => {
    console.log(err);
    return results(err, null);
  })
};

Token.removeOneRefresh = (id, results) => {
  asyncRedisLpop(id).then(result => {
      console.log("delete oldest token");
      return results(null,result);
    })
    .catch(err => {
      console.log(err);
      return results(err, null);
    });
}

Token.createRefresh = (refreshToken, results) => {
  asyncRedisRpush(refreshToken.userId,refreshToken.refreshToken).then(() => {
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

module.exports = Token;