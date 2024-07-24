import { v4 as uuid } from "uuid";
import { SchemaUsuario } from "../schemas/usuarios.js";
import { v2 as cloudinary } from 'cloudinary';
import pkg from 'bcryptjs';
import { Resend } from 'resend';
import { main } from "../helpers/nodemailer.js";

cloudinary.config({
    cloud_name: 'mas58',
    api_key: '524719663542157',
    api_secret: 'ATvr0kFgSXSToBEboAm0TCmSDCI',
    secure: true
})

export const usuariosGuardar = async (req, res) => {

    const { nombre, password, correo, direccion, numero, apellido, rol = 'user', telefono } = req.body;

    const sal = pkg.genSaltSync(10);
    const hash = pkg.hashSync(password, sal);
    const passwordEncrypt = hash;

    try {
        // guardar usuario
        const usuarios = new SchemaUsuario({
            nombre, password: passwordEncrypt, correo, direccion,
            numero, apellido, rol, telefono
        });

        usuarios.save();
        return res.status(200).json({ msg: 'Usuario Registrado con Exito' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error en la conexión, contacte a su administrador' });
    }
}

export const consultarUsuarios = async (req, res) => {
    try {
        const usuarios = await SchemaUsuario.find({ estado: true });
        if (usuarios.length <= 0) return res.status(400).json({ msg: 'No se encontraron usuarios activos' })
        return res.status(200).json({ usuarios })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Error en la conexión, contacte a su administrador' });
    }
}

export const actualizarUsuario = async (req, res) => {

    const { id } = req.params;
    const { _id, password, google, rol, estado, ...rest
    } = req.body;

    try {
        const usuario = await SchemaUsuario.findByIdAndUpdate(id, rest);
        return res.status(200).json({
            rest
        })
    } catch (err) {
        console.log("errorsss", err)
        return res.status(500).json({ msg: 'Error en la conexión, contacte a su administrador' })
    }
}


export const borrarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await SchemaUsuario.findByIdAndUpdate(id, { estado: false });
        if (usuario.estado === false) res.status(400).json({ msg: 'usuario de encuentra desabilitado' })

       return res.status(200).json({
            usuario,
            msg: 'Usuario desabilitado'
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Error en la conexión, contacte a su administrador' })
    }
}

export const consultarUsuario = async (req, res) => {
    const { id } = req.header;
    try {
        const usuario = await SchemaUsuario.findById({ _id: id.replace(/["]+/g, '') });
       return  res.status(200).json({
            id: usuario._id,
            nombre: usuario.nombre.replaceAll('_',' '),
            rol: usuario.rol,
            image: usuario.image,
            direccion: usuario.direccion,
            telefono: usuario.telefono,
            correo: usuario.correo
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: 'Error en la conexión, contacte a su administrador' })
    }
}

export const actualizarRol = async (req, res) => {

    const { id } = req.body;
    try {
        const usuario = await SchemaUsuario.findByIdAndUpdate(id, { rol: 'admin' })

        if (usuario.estado === false) return res.status(400).json({ msg: 'Usuario se encuentra desabilitado no se puede cumplir con su requerimiento' })
        if (usuario.rol === 'admin') return res.status(400).json({ msg: 'Usuario ya es administrador' });
        return res.status(200).json({ msg: 'Rol del usuario actualizado con exito !!!' })
    } catch (error) {
        return res.status(500).json({ msg: 'Error en la conexión, contacte a su administrador' });
    }

}


export const cargaImage = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'La imagen es requerida' })
    }
    const { tempFilePath, name } = req.files.archivo;
    const { id } = req.params;

    const { mimetype } = req.files.archivo;


    if (mimetype !== 'image/jpg' && mimetype !== 'image/png' && mimetype !== 'image/jpeg'
        && mimetype !== 'image/gif' && mimetype !== 'image/HEIC' && mimetype !== 'image/webp'
        && mimetype !== 'image/avif' && mimetype !== 'image/heic' && mimetype !== 'application/octet-stream') {
        return res.status(400).json({
            msg: 'la extension no es valida'
        })
    }
    try {
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
            folder: 'usuariosPerfil',
            format: 'jpg',
            use_filename: true,
            transformation: {
                width: 300,
                height: 300
            }
        })
        const user = await SchemaUsuario.findByIdAndUpdate(id, { image: secure_url })
        if (user.image) {
            const imgSplit = user.image.split('/');
            const imgId = imgSplit[imgSplit.length - 1].split('.');
            cloudinary.uploader.destroy("usuariosPerfil/" + imgId[0]);
        }
        return res.status(200).json(secure_url);
    } catch (err) {
       return res.status(500).json({
            msg: 'Error en la conexión, contacte a su administrador'
        })
    }
}

export const actualizarClave = async (req, res) => {

    const { password , email} = req.body;

    const usuario = await SchemaUsuario.find({correo: email});
    const id = JSON.stringify(usuario[0]._id);
    const idString = id.slice(1,id.length -1);

    const sal = pkg.genSaltSync(10);
    const hash = pkg.hashSync(password, sal);
    const passwordEncrypt = hash;

    await SchemaUsuario.findByIdAndUpdate({_id: idString}, {password: passwordEncrypt})
    try {
        if (usuario.length === 0) return res.status(400).json({ msg: 'No se encontraron resultados' })

            const html = '<p>Su Contraseña se actualizo con exito!!! </p>';
            main(usuario[0].correo , '',html)
        return res.status(200).json({ msg: 'Actualizado' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Error en la conexión, contacte a su administrador' });
    }

}

export const enviarEmail = async (req, res) => {


    const { email = '', jwt } = req.body;
    const usuario = await SchemaUsuario.find({ correo: email })
    try {
        if (usuario.length === 0) return res.status(400).json({ msg: 'No se encontraron resultados' })
            main(usuario[0].correo , jwt, '')
        return res.status(200).json({ jwt })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: 'Error en la conexión, contacte a su administrador' });
    }

}

