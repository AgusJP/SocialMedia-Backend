const multer = require("multer");
const path = require("path");

module.exports = {
  dest: path.resolve(__dirname, "..", "tmp", "uploads"),
  //Configuración de como almacenar las imágenes.
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve(__dirname, "..", "tmp", "uploads"));
    },
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      //Hacer que no se repita el nombre de la imagen que suben los usuarios si fuese el mismo.
      callback(null, `${Date.now()}-${name}${ext}`);
    }
  }),
  limits: {
    //Limite de peso de la imagen de 10mb
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    const allowedTypesImages = [
      "image/jpeg",
      "image/png",
      "image/pjpeg",
      "image/gif"
    ];

    if (allowedTypesImages.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"));
    }
  }
};