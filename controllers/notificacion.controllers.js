
import { SchemaNotify } from "../schemas/notify.js";
import { SchemaUsuario } from "../schemas/usuarios.js";

export const saveNotify = async (req, res) => {

    console.log('aqui llego')
    const { id } = req.params;
    const { endpoint } = req.body;
    const { auth, p256dh } = req.body.keys;

/*     console.log('¿body', req.body , 'id' , id) */{}
    if(id){
         const usuario = await SchemaUsuario.findById(id)

        if(Object.keys(usuario.notify).length === 0){
            console.log(usuario.notify)
              return res.status(200).json({
                msg:'notify: existente'
              })
         }



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
/*       const result = await SchemaNotify.find(auth).populate(
        {
            path:'usuario',
            select:'id'
        }
      ) 
      console.log('result' , result);
    
      SchemaNotify.create({
        endpoint , auth , p256dh
      }) */

   /*  const vapidKeys = {
        publicKey: 'BLbYE-LHO-H7zD53WcZ_KPYaLh6G70VrMiOngCSTp3P8boggr7T-NxNnIoh7RMpcRq9fWXHCI3MeyV9ACqezm_k',
        privateKey: '7Y6Td9C6xHFlhK3zeRb5hLK-3qya2PFhxm6Cs9gnyvc'
    } */

  /*   webpush.setVapidDetails(
        'mailto:hernays12@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
 */
 /*    webpush.getVapidHeaders(
        'https://dubenails.xyz',
        'mailto:hernays12@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey,
        'aes128gcm'
    ) */

  /*   const pushSubscription = {
        endpoint,
        expirationTime: null,
        keys: {
            auth,
            p256dh
        }
    } */

  /*   const payload = {
        "notification": {
            "title": "saludos",
            "body": "desde el body",
            "vibrate": [100, 50, 100],
            "image": "https://cdn-icons-png.flaticon.com/512/1088/1088537.png",
            "data": {
                "dateOfArrival": Date.now(),
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "hernays"
            }],

        }
    } */


   /*  webpush.sendNotification(pushSubscription, JSON.stringify(payload))
        .catch(error => {
            console.log('error', error)
            return res.status(500).json({
                msg: 'ocurrio un error en el servidor'
            })
        })
        .then(exito => {
            console.log('extisosss', exito)
            return res.status(200).json({ msg: 'notificado con exito' })
        }) */

    }