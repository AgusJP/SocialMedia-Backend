const bcryptjs = require('bcryptjs');

const passwordCompare = async (currentPassword, PasswordDB) => {
    return await bcryptjs.compare(currentPassword, PasswordDB);
}

module.exports = passwordCompare;