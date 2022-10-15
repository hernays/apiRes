
import  jwt, { decode } from "jsonwebtoken";
import { SchemaUsuario } from "../schemas/usuarios.js";
import pkg from 'bcryptjs';


export const generarJWT = async( req , res , next ) => {

    const { nombre , password} = req.body;
      
    console.log(nombre , password)

    // validar si el correo existe en la DB
    const usuario = await SchemaUsuario.find({nombre});
    if(usuario.length <= 0)  
    res.status(400).json({msg:'nombre invalido'})
    
    req.usuario = usuario;
    const passworCompare = pkg.compareSync(password, usuario[0].password); // true

    // validar si el password coincide con la DB
    if(!passworCompare) 
    res.status(400).json({ msg: 'la contraseña es invalida'});

    const uid = usuario[0]._id;
    req.token = jwt.sign(JSON.stringify(uid) , 'hernaysgonzalez');
    req.usuario = usuario;
    next();
}


export const validarUsuarioAdmin = async( req , res , next) => {

    const { authorization } = req.headers;
    try{
    const decode = jwt.verify( authorization , 'hernaysgonzalez');
    const usuario = await SchemaUsuario.find({decode});
    if(usuario[0].rol !== 'admin'){
        return res.status(400).json({
            msg: 'no tienes permiso para eliminar usuarios'
        })
    }

    }catch(err){
        console.log(err);
       return res.status(400).json({ msg:'token invalido'})
    }
    next();
}

export const validarUsuarioConectado = (req , res , next) => {

    const { authorization } = req.headers;

    let decode;
    try{
        decode = jwt.verify( authorization , 'hernaysgonzalez');
   
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:'Error de autenticación'});
    }

    req.header.id = decode;
    next();
}