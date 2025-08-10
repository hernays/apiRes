import { SchemaUsuarioRegister } from "../schemas/usuarioRegister.js";

export const consultarUsuariosRegister = async (req, res) => {
    const { letra } = req.body;
    const palabra = new RegExp(`${letra}`, 'i')
    console.log(palabra)
    try {
        const usuarios = await SchemaUsuarioRegister.find({correo: palabra})
        if (usuarios.length <= 0) return res.status(201).json({ msg: 'No se encontraron usuarios activos' })
        return res.status(200).json({ usuarios })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Error en la conexión, contacte a su administrador' });
    }
}