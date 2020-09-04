const crypto = require('crypto');

function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('base64');
}

module.exports = {
  hashPassword
};