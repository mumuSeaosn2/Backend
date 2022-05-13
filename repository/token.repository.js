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
    }).then(result => {
        console.log("insert token");
        results(null, newToken)
        return;
      })
      .catch(err => {
        results(err,null);
        console.log(err);
        return;
      });
}

Token.findById = (id, results) => {
  model.Token.findAll

}