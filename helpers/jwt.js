
import  jwt, { decode } from "jsonwebtoken";
import { SchemaUsuario } from "../schemas/usuarios.js";


export const generarJWT = async( req , res , next ) => {

    const { correo , password} = req.body;

    // validar si el correo existe en la DB
    const usuario = await SchemaUsuario.find({correo});
    if(usuario.length <= 0)  
    res.status(400).json({msg:'correo invalido'})
    
    req.usuario = usuario;
    const passwordDB = usuario[0].password;
    // validar si el password coincide con la DB
    if(password !== passwordDB) 
    res.status(400).json({ msg: 'la contraseña es invalida'});

    const uid = usuario[0]._id;
    req.token = jwt.sign(JSON.stringify(uid) , process.env.secretKey );
    next();
}


export const validarUsuarioAdmin = async( req , res , next) => {

    const { authorization } = req.headers;
    try{
    const decode = jwt.verify( authorization , process.env.secretKey);
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
        decode = jwt.verify( authorization , process.env.secretKey);
   
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:'Error de autenticación'});
    }

    req.id = decode;
    next();
}