import { validationResult } from 'express-validator';
import { SchemaUsuario } from "../schemas/usuarios.js";
import { SchemaRole } from '../schemas/rol.js';



// validar si el correo es valido

export const validarCampos = async(req , res , next) => {

    const { errors } = await validationResult(req);

    if(errors.length >= 1){
        const { msg } = errors[0];
       return  res.status(400).json({msg} ); 
    }

    next();
}

// validar si el correo existe en la base de datos

export const validarEmailExiste = async( req , res , next ) => {
    const { correo } = req.body;
    const validarCorreo = await SchemaUsuario.findOne( { correo }); 

    if(validarCorreo) res.status(400).json({ msg : 'el correo ya existe'});
    next();
}

export const validarRol = async( rol ) => {
    const role = await SchemaRole.findOne({ rol });
    if(!role) throw new Error('Rol invalido')
}

export const validarId = async ( id ) => {
    const validar = await SchemaUsuario.findById(id);
    if(!validar) throw new Error('No existe el usuario');
}