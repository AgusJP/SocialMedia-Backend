const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Se guarda el token almacenado en la propiedad authorization de la request.
  const authHeader = req.headers.authorization;

  //No se encuentra el token en los headers de autorización.
  if (!authHeader) return res.status(401).json({ error: "No autorizado" });

  //El token se basa en dos partes, un esquema y el propio token.
  const parts = authHeader.split(" ");
  if (parts.length !== 2)
    return res.status(401).send({ error: "Error con el Token" });

  const [scheme, token] = parts;
 
  /*El contenido del encabezado debe tener el siguiente aspecto: Authorization: Bearer <token>.
   Si no se encuentra la keyword Bearer en el esquema, estaría mal formateado*/
  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Token mal formateado" });
  
  /*Se termina de verificar el token con la secretword y si todo va bien decodificamos la 
  id del user que anteriormente se pasó como payload para formar el jwt y esta id la pasamos
  como propiedad del req, ya que será utilizada en el controlador para realizar las operaciones con el usuario*/
  jwt.verify(token, process.env.SIGNATURE_TOKEN, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token invalido" });
    req.userId = decoded.id;  
    return next();
  }); 
};