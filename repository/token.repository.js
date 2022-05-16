const { token } = require("morgan");
const model = require("../models");

const Token = function(token) {
  this.id = token.id;
  this.accessToken = token.accessToken;
  this.refreshToken = token.refreshToken;
};

Token.create = (newToken, results) => {
    model.Token.create({
      id : newToken.id,
      accessToken: newToken.accessToken,
      refreshToken: newToken.refreshToken,
    }).then(() => {
        console.log("insert token");
        results(null, newToken)
        return;
      })
      .catch(err => {
        results(err,null);
        console.log(err);
        return;
      });
};

Token.findById = (id, results) => {
  model.Token.findOne({
    raw: true,
    where: {id: id},
    attribute:['id','refreshToken','accessToken'],
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
    attribute:['id', 'refreshToken', 'accessToken'],
  })
  .then(result => {
    return results(null, result);
  })
  .catch(err => {
    console.log(err);
    return results(err, null);
  })
};

Token.remove = async (id, refreshToken, accessToken, results) => {
  await model.Token.destroy({
    where: {id: id, refreshToken: refreshToken, accessToken: accessToken}
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
    attribute:['id','refreshToken','accessToken'],
    order: [['createdAt', 'DESC']],
  })
  .then(result => {
    model.Token.destroy({
      where: {id: result.id, refreshToken: result.refreshToken, accessToken: result.accessToken}
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


module.exports = Token;