import express from 'express';
import { check } from 'express-validator';
import { consultarUsuarios, desactivarUsuario, usuariosGuardar , borrarUsuario , consultarUsuario } from '../controllers/usuarios.controllers.js';
import { validarToken } from '../helpers/jwt.js';
import { validarCampos , validarEmailExiste, validarRol , validarId } from '../helpers/validarCampos.js';


const routerUsuario = express();

routerUsuario.post('/usuarios' , [
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('apellido','el apellido es obligatorio').not().isEmpty(),
    check('password','el Minimo de caracter son 6').isLength({min : 6}),
    check('correo','el correo no es valido').isEmail(),
    check('direccion','las direccion es obligatoria').not().isEmpty(),
    check('telefono','el telefono es obligatoria').not().isEmpty().isNumeric(),
    check('rol').custom( validarRol ),
    validarCampos,
    validarEmailExiste
], usuariosGuardar);


routerUsuario.get('/usuarios', consultarUsuarios );

routerUsuario.get('/usuario/:id' , [
    check('id', 'el id no es valido').isMongoId(),
    check('id').custom( validarId ),
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
] ,desactivarUsuario);

routerUsuario.delete('/usuario/:id' ,[
    validarToken,
    check('id', 'el id no es valido').isMongoId(),
    check('id').custom( validarId ),
    validarCampos
], borrarUsuario);


export default routerUsuario;