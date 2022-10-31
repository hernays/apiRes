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
  
    const usuariosAdmin = await SchemaUsuario.find({rol:'admin'});
        for( const admin of usuariosAdmin){
            if(admin.notify){
                const { endpoint , auth , p256dh } = admin.notify; 
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
                        "title": "DubeNails",
                        "body": "Nueva Hora Agendada",
                        "vibrate": [100, 50, 100],
                        "image": "https://cdn-icons-png.flaticon.com/512/1088/1088537.png",
                        "data": {
                            "dateOfArrival": Date.now(),
                            "primaryKey": 1
                        },
                        "actions": [{
                            "action": "explore",
                            "title": "DubeNails"
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
        }
}