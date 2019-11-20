const crypto = require('crypto');
// SHA256加密
exports.sha256 = function (data) {
    return crypto.createHash('sha256').update(data).digest('hex');
};
