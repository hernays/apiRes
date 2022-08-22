import  express  from "express";
import { check } from "express-validator";

import { authController }  from "../controllers/auth.controller.js";
import { generarJWT } from "../helpers/jwt.js";
import { validarCampos} from "../helpers/validarCampos.js";


const routerAuth = express();

routerAuth.post('/login', [
    check('correo','el correo es obligatorio').isEmail(),
    check('password','el password es obligatorio').isLength(6),
    generarJWT,
    validarCampos
], authController);



export default routerAuth;
