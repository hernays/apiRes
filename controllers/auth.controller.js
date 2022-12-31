import { SchemaUsuario } from "../schemas/usuarios.js";
export const authController = async(req , res) => {

    const { correo , password } = req.body;

    console.log(req.usuario)
    return res.status(200).json({
        token: req.token,
        rol:req.usuario[0].rol,
        alias:req.usuario[0].nombre,
        telefono:req.usuario[0].telefono
    })

}

export const authUsuarios = async(req , res ) => {
      const id = req.header.id;

      const user = await SchemaUsuario.findById({ _id : id.replace(/["]+/g, '') });
    const data = {
        id : user._id,
        nombre : user.nombre,
        rol: user.rol,
        telefono:user.telefono,
        correo:user.correo
    }
      res.status(200).json(data);
}

