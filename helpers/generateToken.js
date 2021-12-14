const jwt = require("jsonwebtoken");

module.exports = payload => {
    return jwt.sign(payload, process.env.SIGNATURE_TOKEN, { expiresIn: 1000000});
}