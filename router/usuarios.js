import express from 'express';
import { check } from 'express-validator';
import { consultarUsuarios, actualizarUsuario, usuariosGuardar , borrarUsuario , consultarUsuario, actualizarRol, cargaImage } from '../controllers/usuarios.controllers.js';
import { validarUsuarioAdmin, validarUsuarioConectado } from '../helpers/jwt.js';
import { validarCampos , validarEmailExiste, validarRol , validarId } from '../helpers/validarCampos.js';


const routerUsuario = express();

routerUsuario.post('/usuarios' , [
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('correo','el correo no es valido').isEmail(),
    check('direccion','las direccion es obligatoria').not().isEmpty(),
    check('password','la contraseña es requerida').not().isEmpty(),
    check('telefono','el telefono es obligatoria').not().isEmpty().isNumeric(),
    check('rol').custom( validarRol ),
    validarCampos,
    validarEmailExiste
], usuariosGuardar);


routerUsuario.get('/usuarios', consultarUsuarios );

routerUsuario.get('/usuario' , [
    validarUsuarioConectado,
   /*  check('id', 'el id no es valido').isMongoId(),
    check('id').custom( validarId ),  */
    validarCampos
], consultarUsuario ); 

routerUsuario.put('/usuario/:id', [
    check('id', 'el id no es valido').isMongoId(),
    check('id').custom( validarId ),
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('apellido','el apellido es obligatorio').not().isEmpty(),
    check('correo','el correo no es valido').isEmail(),
    check('direccion','las direccion es obligatoria').not().isEmpty(),
    check('telefono','el telefono es obligatoria').not().isEmpty().isNumeric(),
    check('rol').custom( validarRol ),
    validarCampos,
    validarEmailExiste
] ,actualizarUsuario);

routerUsuario.put('/usuarioImg/:id', cargaImage);

routerUsuario.delete('/usuario/:id' ,[
    validarUsuarioAdmin,
    check('id', 'el id no es valido').isMongoId(),
    check('id').custom( validarId ),
    validarCampos
], borrarUsuario);

routerUsuario.post('/rol' , [validarUsuarioAdmin] , actualizarRol )

export default routerUsuario;