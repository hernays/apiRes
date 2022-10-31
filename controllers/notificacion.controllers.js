
import { SchemaNotify } from "../schemas/notify.js";
import { SchemaUsuario } from "../schemas/usuarios.js";

export const saveNotify = async (req, res) => {

    const { id } = req.params;
    const { endpoint } = req.body;
    const { auth, p256dh } = req.body.keys;
    if(id){
/*          const usuario = await SchemaUsuario.findById(id)
 */
     /*    if(Object.keys(usuario.notify).length === 0){
            console.log(usuario.notify)
              return res.status(200).json({
                msg:'notify: existente'
              })
         }

 */

      SchemaUsuario.findByIdAndUpdate(id, {notify:{endpoint , auth ,  p256dh}} )
       .then((data) => {
        console.log('update::', data)
        res.status(200).json({
            msg: 'registrado enpoint con exito'
        })
    })
        .catch((error) => {
            console.log('error', error)
            res.status(500).json({
                msg: 'error al registrar endpoint'
            })
       })
    }
    }