const Crypto = require('crypto');

function hash (password) {
    return Crypto.createHmac('sha256', 'kuncirahasia').update(password).digest('hex');
};

module.exports = hash;

