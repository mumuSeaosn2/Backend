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

module.exports = Token;