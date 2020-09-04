const BaseEntity = require('./base-entity').BaseEntity;

class User extends BaseEntity {
  constructor({
    username,
    password,
    signupDate,
    billingInfo,
    shippingInfo,
    games,
    trades
  }) {
    super();
    this.username = username;
    this.password = password;
    this.signupDate = signupDate;
    this.billingInfo = billingInfo;
    this.shippingInfo = shippingInfo;
    this.games = games;
    this.trades = trades;
  }

  get className() {
    return 'user';
  }

  get primaryKey() {
    return { username: this.username };
  }
}

module.exports = {
  User
};