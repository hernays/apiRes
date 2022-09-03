import  express  from "express";
import { check } from "express-validator";

import { authController, authUsuarios }  from "../controllers/auth.controller.js";
import { generarJWT , validarUsuarioConectado } from "../helpers/jwt.js";
import { validarCampos } from "../helpers/validarCampos.js";


const routerAuth = express();

routerAuth.post('/login', [
    check('correo','el correo es obligatorio').isEmail(),
    check('password','el password es obligatorio').isLength(6),
    generarJWT,
    validarCampos
], authController);

routerAuth.get('/authorization', [validarUsuarioConectado] , authUsuarios)



export default routerAuth;
