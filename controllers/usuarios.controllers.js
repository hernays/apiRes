import { v4 as uuid } from "uuid";
import { SchemaUsuario } from "../schemas/usuarios.js";
import {v2 as cloudinary}  from 'cloudinary';

export const usuariosGuardar = async ( req , res ) => {

    const { nombre , password , correo , direccion , numero , apellido , rol = 'user' , telefono } = req.body;

    try {
         // guardar usuario
         const usuarios = new SchemaUsuario( {
            nombre , password , correo , direccion , 
            numero , apellido , rol , telefono
        } );
           
        usuarios.save();
        res.status(200).json({msg: 'Usuario Registrado con Exito'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg : 'Error en la conexión, contacte a su administrador'});
    }
}

export const consultarUsuarios = async( req , res ) => {
    try{
        const usuarios = await SchemaUsuario.find({estado : true});
        if(usuarios.length <= 0) res.status(400).json({ msg : 'No se encontraron usuarios activos' })
        res.status(200).json({ usuarios })
    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Error en la conexión, contacte a su administrador'});
    }
}

export const actualizarUsuario = async( req , res ) => {

    const { id } = req.params;
    const { _id , password , google , rol , estado , ...rest
     } = req.body;
    try{
        const usuario = await SchemaUsuario.findByIdAndUpdate( id , rest );
        res.status(200).json({
            rest
        })
    }catch(err){
        console.log(err)
        res.status(500).json({msg: 'Error en la conexión, contacte a su administrador'})
    }
}


export const borrarUsuario = async( req , res ) => {
    const { id } = req.params;
    try{
        const usuario = await SchemaUsuario.findByIdAndUpdate( id , { estado : false });
        if( usuario.estado === false ) res.status(400).json({ msg : 'usuario de encuentra desabilitado' })
        
        res.status(200).json({
            usuario,
            msg: 'Usuario desabilitado'
        })

    }catch(err){
        console.log(err);
        res.status(500).json({msg: 'Error en la conexión, contacte a su administrador'})
    }
}

export const consultarUsuario = async( req , res ) => {
    const { id } = req.header;
    try{
        const usuario = await SchemaUsuario.findById( { _id : id.replace(/["]+/g, '') }); 
        res.status(200).json({ 
            id:usuario._id,
            nombre:usuario.nombre,
            apellido:usuario.apellido,
            rol:usuario.rol,
            image:usuario.image
        })

    }catch(err){
        console.log(err)
        res.status(500).json({msg: 'Error en la conexión, contacte a su administrador'})
    }
}

export const actualizarRol = async( req , res) => {

    const { id } = req.body;
    try{
        const usuario = await SchemaUsuario.findByIdAndUpdate( id , {rol : 'admin'})
        console.log(usuario)
        if(usuario.estado === false)    return res.status(400).json({msg:'Usuario se encuentra desabilitado no se puede cumplir con su requerimiento'})
        if(usuario.rol    === 'admin')  return res.status(400).json({msg:'Usuario ya es administrador'});
        res.status(200).json({msg : 'Rol del usuario actualizado con exito !!!'})
    }catch(error){
        res.status(500).json({msg: 'Error en la conexión, contacte a su administrador' });
    }

}


/* export const cargaImage = async( req , res ) => {

    const { tempFilePath , name } = req.files.archivo;
    const { id } = req.params;
    console.log(id)
    const extension = name.split('.')

      if(extension[1] !== 'jpg' && extension[1] !== 'png' && extension[1] !== 'jpeg'
      && extension[1] !== 'gif' && extension[1] !== 'heif' && extension[1] !== 'webp'
      && extension[1] !== 'avif'){
         res.status(400).json({
            msg:'la extension no es valida'
         })
      }

    const { secure_url }  = await cloudinary.uploader.upload(tempFilePath);
    try{
        const user = await SchemaUsuario.findByIdAndUpdate(id , {image : secure_url})
       res.status(200).json(secure_url);
    }catch(err){
        res.status(500).json({
            msg:'Error en la conexión, contacte a su administrador'
        })
    }
} */