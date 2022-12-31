import { SchemaAgendas } from "../schemas/agenda.js";
import moment from "moment";
import { SchemaUsuario } from "../schemas/usuarios.js";
import webpush from 'web-push';

moment().locale('es');
export const guardarAgenda = async(req , res) => {

    const { nombre , servicio , dia , hora , horaServicio , telefono , mes , id , nuevo , estado , token} = req.body;
       const tramo = hora + horaServicio;
       let valor = 0;

       switch(servicio){
        case 'Acrilicas' : valor = 18; break;
        case 'Polygel' : valor = 18; break;
        case 'Relleno acrilico/polygel' : valor = 15; break;
        case 'kapping (revestimiento)' : valor = 15; break;
        case 'Esmaltado Permanente' : valor = 10; break;
        case 'Manicura (limpieza)' : valor = 10; break;
        case 'Solo Retiro' : valor = 5; break;
       }

        try{

             await SchemaAgendas.remove({mes : mes-2})
             const usuario = id;
            const agenda = new SchemaAgendas({
                usuario , nombre , servicio, dia, hora , mes , tramo , telefono , valor , nuevo , token , estado
            })

            agenda.save();
            notify(nombre , mes , dia , hora, servicio);
            return res.status(200).json({
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
        const agenda = await SchemaAgendas.find({dia : dia , mes : mes}).populate({
            path:'usuario',
            select:'nombre apellido rol'
        })
        
        if(agenda.length === 0) return res.status(200).json({
            msg:'No se encontraron registros.'
        })
        
        return res.status(200).json({
            agenda
        })
    }catch(err){
        console.log(' error')
        return res.status(500).json({msg:'error en el servidor'})
    }

}

export const habilitarDia = async(req , res) => {

    const { dia , mes , habilitar} = req.params;
    try{
        const agenda = await SchemaAgendas.findOneAndUpdate( {dia : dia , mes : mes} , { diaHabilitado : habilitar });
        return res.status(200).json(
            {habilitar}
        );
    }catch(error){
        return res.status(500).json({msg:'error en el servidor'})
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

export const actualizarVista = async(req , res) => {
         
    const  ids =  req.body;

    try{
        ids.forEach(async (id) => {
            await SchemaAgendas.findByIdAndUpdate(id, {nuevo : false})
        });
        return res.status(200).json(false)
    }catch(error){
        return res.status(500).json({msg: 'error en el servidor'});
    }

}

export const totalMes = async(req , res) => {
         
    const { mes } = req.params;

    try{
        const agendas = await SchemaAgendas.find({mes:mes}).select({'valor' : 1 , _id :0})
        return res.status(200).json(agendas)

    }catch(error){
        return res.status(500).json({msg: 'error en el servidor'});
    }

}

export const agregarToken = async( req , res ) => {

}

const notify = async(nombre ,mes , dia , hora, servicio) => {
  
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
            
                switch(mes){
                      case 0 : mes = 'Enero'; break;
                      case 1 : mes = 'Febrero'; break;
                      case 2 : mes = 'Marzo'; break;
                      case 3 : mes = 'Abril'; break;
                      case 4 : mes = 'Mayo'; break;
                      case 5 : mes = 'Junio'; break;
                      case 6 : mes = 'Julio'; break;
                      case 7 : mes = 'Agosto'; break;
                      case 8 : mes = 'Septiembre'; break;
                      case 9 : mes = 'Octubre'; break;
                      case 10 : mes = 'Noviembre'; break;
                      case 11 : mes = 'Diciembre'; break;
                }
                 const payload = {
                    "notification": {
                        "title": "Nueva Hora Agendada",
                        "body": `${nombre} agendo el ${dia} de ${mes} a las ${( String(hora).split('').length > 2) ? String(hora).split('.')[0]+':30' : hora+':00'}  Servicio - ${servicio}`,
                        "vibrate": [100, 50, 100],
                        "image": "https://res.cloudinary.com/mas58/image/upload/v1665799264/a3ubvxjjoxr934mc1rtn.jpg",
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
                    })
                    .then(exito => {
                        console.log('extisosss', exito)
                    }) 
            }
        }
}