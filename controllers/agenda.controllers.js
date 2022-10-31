import { SchemaAgendas } from "../schemas/agenda.js";
import moment from "moment";
import { SchemaUsuario } from "../schemas/usuarios.js";
import webpush from 'web-push';

moment().locale('es');
export const guardarAgenda = async(req , res) => {

    const { nombre , servicio , dia , hora , horaServicio , telefono , mes , id} = req.body;
       const tramo = hora + horaServicio;


        notify();
   
        try{
            const agenda = new SchemaAgendas({
                nombre , servicio, dia, hora , mes , tramo , telefono
            })
        
            agenda.save();
            res.status(200).json({
                msg: 'agenda registrada con exito!!!'
            })
        }catch(err){
             res.status(500).json({msg: 'error en el servidor'})
        }

}

export const getAgenda = async(req ,res) => {

    try{
   
        const agenda = await SchemaAgendas.find();
        
        if(agenda.length === 0) return res.status(400).json({
            msg:'No se encontraron registros.'
        })
        
        res.status(200).json({
            agenda
        })
    }catch(err){
        console.log(' error')
        res.status(500).json({msg:'error en el servidor'})
    }

}

export const getAgendaDay = async(req ,res) => {

    const { dia , mes } = req.params;
    try{
        const agenda = await SchemaAgendas.find({dia : dia , mes : mes});
   
        if(agenda.length === 0) return res.status(400).json({
            msg:'No se encontraron registros.'
        })
        
        return res.status(200).json({
            agenda
        })
    }catch(err){
        console.log(' error')
        res.status(500).json({msg:'error en el servidor'})
    }

}

export const borrarMes = async( req , res) => {
    const { mes } = req.body;

    try{
        const agenda = await SchemaAgendas.remove({mes : mes})
        res.status(200).json({msg:'borrado con exito'})
    }catch(err){
        res.status(500).json({msg : 'error en el servidor'})
    }
}

export const borrarHoras = async(req , res) => {

    const { nombre , dia } = req.body;
    try{
        const agenda = await SchemaAgendas.deleteOne({nombre: nombre , dia: dia})
        res.status(200).json({msg: 'agenda eliminada con exito'});
    }catch(err){
      res.status(500).json({msg:'error en el servidor'})
    }

}

const notify = async() => {
  
    const usuariosAdmin = await SchemaUsuario.find({rol:'admin' , nombre : 'hernays'});

    console.log("usuario",usuariosAdmin)
          const { endpoint , auth , p256dh } = usuariosAdmin[0]; 
            console.log("datos de prueba",endpoint , auth , p256dh ) 


    const vapidKeys = {
        publicKey: 'BBG9Ywk7mvin-aXmEpLorIVjGeo_8cahwFMYXqFD1VKsCldi_dAYXssJ5moV2pe3vcdqzCtXWS4ru8jn9UlGlrs',
        privateKey: '2H-ud4yYXHowo764X4T7q82PsVZ0soGDEDGtAmcDB2w'
    } 

     webpush.setVapidDetails(
        'mailto:hernays12@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
 
     webpush.getVapidHeaders(
        'https://dubenails.xyz',
        'mailto:hernays12@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey,
        'aes128gcm'
    ) 

     const pushSubscription = {
        endpoint,
        expirationTime: null,
        keys: {
            auth,
            p256dh
        }
    } 

     const payload = {
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
    } 


    webpush.sendNotification(pushSubscription, JSON.stringify(payload))
        .catch(error => {
            console.log('error', error)
          /*   return res.status(500).json({
                msg: 'ocurrio un error en el servidor'
            }) */
        })
        .then(exito => {
            console.log('extisosss', exito)
            /* return res.status(200).json({ msg: 'notificado con exito' }) */
        }) 
}

/* const notify = async(id)=> {


    const usuariosAdmin = await SchemaUsuario.find({rol:'admin'});


       for(let admin of usuariosAdmin){
          /* if(admin.notify === null){
           return false
          } */

              /* const { endpoint , auth , p256dh } = admin.notify; */
            /*   console.log("datos de prueba",endpoint , auth , p256dh ) */

            /*   const endpoint = 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABjX_vtjkJhkKbhOvtvR8XMcQPiHnDKw5Q0p0zs7gc4KfxvmICUPnHIz0wrgcjKisvjw1qqVQRQFOPr7Skid_yB28p7ltL_llmkZbtE1Yb0-meSR36WEa1RpMxSQeiUKmfvlFhShQZ7w6oqOgryKLFVucw7XNC5kJGR3XVPADHlfzQIkT0'
              const auth = 'IR6XrrvfSU3qdhCbZPuHNg';
              const p256dh = 'BO7sAKHOExPxlGGZp9xQKBP9U-JZonOzc5hTdjAC5B2CkX5qrciprkg00SkV-jNVg792Yw7Q5WG4LcdUKhNVpjM';
              */ /*    const AdminKeys = {
            endpoint : admin.notify.endpoint, 
            auth: admin.notify.auth,
            p256dh : admin.notify.p256dh
        } */
      /*   if(endpoint === undefined){
             return false;
        } */
    
      /*     const vapidKeys = {
            publicKey: 'BBG9Ywk7mvin-aXmEpLorIVjGeo_8cahwFMYXqFD1VKsCldi_dAYXssJ5moV2pe3vcdqzCtXWS4ru8jn9UlGlrs',
            privateKey: '2H-ud4yYXHowo764X4T7q82PsVZ0soGDEDGtAmcDB2w'
        } 
     */
        /* console.log("aquiii",vapidKeys)
    
      webpush.setVapidDetails(
            'mailto:hernays12@gmail.com',
            vapidKeys.publicKey,
            vapidKeys.privateKey
        );
     
         webpush.getVapidHeaders(
            'https://dubenails.xyz',
            'mailto:hernays12@gmail.com',
            vapidKeys.publicKey,
            vapidKeys.privateKey,
            'aes128gcm'
        ) 
    
        console.log('clienteeeeeeeeeee',
            auth,
            p256dh 
            ,endpoint)
         const pushSubscription = {
            endpoint,
            expirationTime: null,
            keys: {
                auth,
                p256dh
            }
        } 
    
         const payload = {
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
        } 
    
    
        webpush.sendNotification(pushSubscription, JSON.stringify(payload))
            .catch(error => {
                console.log('error', error)
            })
            .then(exito => {
                console.log('extisosss', exito)
            }) 

       } */

/*     const AdminKeys = {
        endpoint, 
        auth, 
        p256dh 
    }

      const vapidKeys = {
        publicKey: p256dh,
        privateKey: auth
    } 

    console.log("aquiii",vapidKeys)

  webpush.setVapidDetails(
        'mailto:hernays12@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );
 
     webpush.getVapidHeaders(
        'https://dubenails.xyz',
        'mailto:hernays12@gmail.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey,
        'aes128gcm'
    ) 

     const pushSubscription = {
        endpoint : AdminKeys.endpoint,
        expirationTime: null,
        keys: {
            auth : AdminKeys.auth,
            p256dh : AdminKeys.p256dh
        }
    } 

     const payload = {
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
    } 


    webpush.sendNotification(pushSubscription, JSON.stringify(payload))
        .catch(error => {
            console.log('error', error)
            return res.status(500).json({
                msg: 'ocurrio un error en el servidor'
            })
        })
        .then(exito => {
            console.log('extisosss', exito)
            return res.status(200).json({ msg: 'notificado con exito' })
        })  */