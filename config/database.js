const dotenv = require("dotenv");
dotenv.config();

const ConfigDB = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  define: {
    timestamps: true, //Para manejar los campos created_at y updated_at
    underscored: true  //Permitir campos con _
  }
};

module.exports = ConfigDB;