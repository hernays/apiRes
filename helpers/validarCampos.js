import { validationResult } from 'express-validator';
import { SchemaUsuario } from "../schemas/usuarios.js";
import { SchemaRole } from '../schemas/rol.js';



// validar si el correo es valido

export const validarCampos = async (req, res, next) => {

    const { errors } = await validationResult(req);

    if (errors.length >= 1) {
        const { msg } = errors[0];
        return res.status(400).json({ msg });
    }

    next();
}

// validar si el correo existe en la base de datos

export const validarEmailExiste = async (req, res, next) => {
    const { id } = req.params;
    const { correo, nombre } = req.body;
    const validarCorreo = await SchemaUsuario.findOne({ correo });
    const validarNombre = await SchemaUsuario.findOne({ nombre });

    if (id) {
        const validarCorreoId = await SchemaUsuario.findById(id);
        const validarNombreId = await SchemaUsuario.findById(id);

        if (validarCorreoId.correo === correo && validarNombreId.nombre === nombre) {
        } else if (validarCorreoId.correo !== correo) {
            if (validarCorreo) return res.status(400).json({ msg: 'El correo ya se encuentra registrado' });
        }
        else if ( validarNombreId.nombre !== nombre) {
            if (validarNombre) return res.status(400).json({ msg: 'El alias ya existe por favor intente con otro' });
        } else {
            if (validarCorreo) return res.status(400).json({ msg: 'El correo ya se encuentra registrado' });
            if (validarNombre) return res.status(400).json({ msg: 'El alias ya existe por favor intente con otro' });
        }
    } else {
        if (validarCorreo) return res.status(400).json({ msg: 'El correo ya se encuentra registrado' });
        if (validarNombre) return res.status(400).json({ msg: 'El alias ya existe por favor intente con otro' });
    }
    next();
}

export const validarRol = async (rol) => {
    const role = await SchemaRole.findOne({ rol });
    if (!role) throw new Error('Rol invalido')
}

export const validarId = async (id) => {
    const validar = await SchemaUsuario.findById(id);
    if (!validar) throw new Error('No existe el usuario');
}

export const validarhora = async (hora) => {
    if (hora === 0) throw new Error('la hora es obligatoria');
}

