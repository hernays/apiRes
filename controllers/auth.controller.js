import { SchemaUsuario } from "../schemas/usuarios.js";
export const authController = async(req , res) => {

    const { correo , password } = req.body;

    res.status(200).json({
        token: req.token
    })

}

export const authUsuarios = async(req , res ) => {
      const id = req.header.id;

      const user = await SchemaUsuario.findById({ _id : id.replace(/["]+/g, '') });
    const data = {
        nombre : user.nombre,
        rol: user.rol
    }
      res.status(200).json(data);
}

