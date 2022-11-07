
import { SchemaNotify } from "../schemas/notify.js";
import { SchemaUsuario } from "../schemas/usuarios.js";

export const saveNotify = async (req, res) => {

    const { id } = req.params;
    const { endpoint } = req.body;
    const { auth, p256dh } = req.body.keys;
    if(id){

        try{
            SchemaUsuario.findByIdAndUpdate(id, {notify:{endpoint , auth ,  p256dh}} )
            .then((data) => {
             console.log('update::', data)
             return res.status(200).json({
                 msg: 'registrado enpoint con exito'
             })
         })
             .catch((error) => {
                 console.log('error', error)
                return res.status(500).json({
                     msg: 'error al registrar endpoint'
                 })
            })
        }catch(error){
            return res.status(500).json({msg:'error en el servidor'})
        }
    }else{
        try{
            await SchemaNotify.create(endpoint , auth, p256dh );
            return res.status(200).json({msg:'guardado con exito'})
        }catch(error){
            return res.status(500).json({msg:'error en el servidor'})
        }

    }
    }