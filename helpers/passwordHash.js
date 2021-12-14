const bcryptjs = require("bcryptjs");

/**
 * Hashing a password
 * @param {Password to be hashed} password 
 * @returns Password hashed
 */
const passwordHash = async (password) => {
    //Salt es un fragmento aleatorio que se usará para generar el hash asociado a la password.
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);
    return passwordHash;
}

module.exports = passwordHash;