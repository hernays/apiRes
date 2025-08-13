import { SchemaAgendas } from "../schemas/agenda.js";
import moment from "moment";
import { SchemaUsuario } from "../schemas/usuarios.js";
import webpush from 'web-push';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { main } from "../helpers/nodemailer.js";
import 'moment-timezone'
import { formatTime } from "../helpers/formatTime.js";
import { SchemaUsuarioRegister } from "../schemas/usuarioRegister.js";

moment.lang('es');
moment.tz('America/New_York');
export const guardarAgenda = async (req, res) => {

    const { nombre, servicio, dia, hora, horaServicio, telefono, mes, id, nuevo, estado, token, correo, diaHabilitado = true } = req.body;


    const tramo = hora + horaServicio;
    let valor = 0;

    switch (servicio) {
        case 'Manicura (solo limpieza)': valor = 25;
        case 'Manicura luxury': valor = 35; break;
        case 'Acrilicas': valor = 45; break;
        case 'Polygel': valor = 45; break;
        case 'kapping gel': valor = 40; break;
        case 'Pedicura clasica': valor = 40; break;
        case 'Pedicura + kapping': valor = 45; break;
        case 'Retoque': valor = 20; break;
        case 'Retiro de esmaltado': valor = 15; break;
        case 'Retiro de acrilica o poligel': valor = 25; break;
    }



    try {

        if(correo.length){
            const getUsuariosRegister = await SchemaUsuarioRegister.find({correo: correo.trim()});
            console.log('getUsuariosRegister',getUsuariosRegister)
            if(!getUsuariosRegister.length){
                // guardar Usuario Express
                const usuarioRegister = new SchemaUsuarioRegister({
                    nombre, correo, telefono
                });
                usuarioRegister.save();
            }
        }

        


        await SchemaAgendas.remove({ mes: mes - 2 })
        const usuario = id;
        const agenda = new SchemaAgendas({
            usuario, nombre, servicio, dia, hora, mes, tramo, telefono, valor, nuevo, token, estado, diaHabilitado, correo
        })

        agenda.save();

        if (correo !== 'duberlysgelian@gmail.com') {
            const year = moment().year();
            const mesFormat = moment([year, mes]).format('MMMM');
            const numeroHora = formatTime(hora);
            const html = `<p
            style="
            font-size: 18px;
            "
            >Su cita se agendo con Exito!!! para el dia ${dia} del mes de ${mesFormat} a las ${numeroHora}</p>
            <br/> <br/>
            Direccion: 50 Starling CT, henrico, 23229
            `;
            main(correo, '', html)
        }
        notify(nombre, mes, dia, hora, servicio, 'agendar');
        return res.status(200).json({
            msg: 'agenda registrada con exito!!!'
        })
    } catch (err) {
        res.status(500).json({ msg: 'error en el servidor agenda' })
    }

}

export const getAgenda = async (req, res) => {

    try {
        console.log('acaaaaa 1')

        const agenda = await SchemaAgendas.find();
        if (agenda.length === 0) return res.status(400).json({
            msg: 'No se encontraron registros.'
        })
        return res.status(200).json({
            agenda
        })
    } catch (err) {
        console.log(' error')
        return res.status(500).json({ msg: 'error en el servidor' })
    }

}

export const getAgendaDay = async (req, res, server = '') => {
    const { dia, mes } = req.params;
    console.log('acaaaa 2')
    try {
        const agenda = await SchemaAgendas.find({ dia: dia, mes: mes }).populate({
            path: 'usuario',
            select: 'nombre apellido rol correo'
        })
        if (agenda.length === 0) {
            return res.status(200).json({
                msg: 'No se encontraron registros.'
            })
        }
        const data = agenda.filter(data => data.estado === true)
        if (server === 'server') {
            return data;
        } else {
            return res.status(200).json({
                data
            })
        }
    } catch (err) {
        console.log(' error', err)
        if (server) {
            return false;
        } else {
            return res.status(500).json({ msg: 'error en el servidor' })
        }
    }

}

export const habilitarDia = async (req, res) => {

    const { dia, mes, habilitar } = req.params;
    try {
        if (habilitar) {
            const deleteAgenda = await SchemaAgendas.deleteOne({ nombre: 'nombre' })
        }
        const agenda = await SchemaAgendas.findOneAndUpdate({ dia: dia, mes: mes }, { diaHabilitado: habilitar });
        return res.status(200).json(
            { habilitar }
        );
    } catch (error) {
        return res.status(500).json({ msg: 'error en el servidor' })
    }
}

export const borrarMes = async (req, res) => {
    const { mes } = req.body;

    try {
        const agenda = await SchemaAgendas.remove({ mes: mes })
        return res.status(200).json({ msg: 'borrado con exito' })
    } catch (err) {
        return res.status(500).json({ msg: 'error en el servidor' })
    }
}

export const borrarHoras = async (req, res) => {

    const { nombre, dia, hora, servicio, mes } = req.body;
    try {
        const agendaGet = await SchemaAgendas.find({ dia: dia, mes: mes }).populate({
            path: 'usuario',
            select: 'correo'
        })
        let email = '';
        agendaGet.forEach(element => {
            console.log('elementssss', element)
            console.log('diaaa', dia)
            if (Number(element.dia) === dia) {
                email = element.correo;
            }

        })
        const agenda = await SchemaAgendas.deleteOne({ nombre: nombre, dia: dia })

        console.log('agendasss', agenda)

        notify(nombre, mes, dia, hora, servicio, 'borrar');
        notificarAgendaDelete(servicio, dia, mes, hora, email);
        return res.status(200).json({ msg: 'agenda eliminada con exito' });
    } catch (err) {
        return res.status(500).json({ msg: 'error en el servidor' })
    }

}

export const actualizarVista = async (req, res) => {

    const ids = req.body;

    try {
        ids.forEach(async (id) => {
            await SchemaAgendas.findByIdAndUpdate(id, { nuevo: false })
        });
        return res.status(200).json(false)
    } catch (error) {
        return res.status(500).json({ msg: 'error en el servidor' });
    }

}

export const totalMes = async (req, res) => {

    const { mes } = req.params;
    console.log('aquiiiiii')

    try {
        const agendas = await SchemaAgendas.find({ mes: mes }).select({ 'valor': 1, _id: 0 })
        return res.status(200).json(agendas)

    } catch (error) {
        return res.status(500).json({ msg: 'error en el servidor' });
    }

}

export const usuariosMes = async (req, res) => {

    console.log('pasando alaaa')
    const { mes } = req.params;

    console.log('requestt', req.params)
    try {
        const agendas = await SchemaAgendas.find({mes})

        return res.status(200).json({agendas})

    } catch (error) {
        return res.status(500).json({ msg: 'error en el servidor' });
    }

}

export const buscarIdUsuario = async (req, res) => {
    const { id, dia, hora, mes } = req.params;
    try {
        if (!id || !dia || !hora || !mes) {
            return res.status(404).json({ msg: 'Algo Salio Mal Vuelva a Intentarlo' })
        }

        const id_comillas = jwt.verify(id, 'hernaysgonzalez').slice(1);
        const idUsuario = id_comillas.slice(0, id_comillas.length - 1)
        if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
            return res.status(400).json({ msg: 'id invalido' })

        }

        let horaFormato = (hora.includes('_')) ? hora.replace('_', '.') : hora;
        const agenda = await SchemaAgendas.find({
            usuario: idUsuario,
            mes,
            dia,
            hora: horaFormato
        });
        return res.status(200).send({ token: agenda[0].token, id: agenda[0]._id })

    } catch (error) {
        return res.status(500).json({ msg: 'error en el servidor' });

    }
}

const notify = async (nombre, mes, dia, hora, servicio, tipoSolicitud) => {

    const usuariosAdmin = await SchemaUsuario.find({ rol: 'admin' });
    for (const admin of usuariosAdmin) {
        if (admin.notify) {
            const { endpoint, auth, p256dh } = admin.notify;
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
                'https://dubenails.com',
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

            switch (mes) {
                case 0: mes = 'Enero'; break;
                case 1: mes = 'Febrero'; break;
                case 2: mes = 'Marzo'; break;
                case 3: mes = 'Abril'; break;
                case 4: mes = 'Mayo'; break;
                case 5: mes = 'Junio'; break;
                case 6: mes = 'Julio'; break;
                case 7: mes = 'Agosto'; break;
                case 8: mes = 'Septiembre'; break;
                case 9: mes = 'Octubre'; break;
                case 10: mes = 'Noviembre'; break;
                case 11: mes = 'Diciembre'; break;
            }
            const payload = {
                "notification": {
                    "title": (tipoSolicitud === 'agendar') ? "Nueva Hora Agendada" : 'Cancelaron La Hora',
                    "body": `${nombre} ${(tipoSolicitud === 'agendar') ? 'agendo' : 'cancelo'} el ${dia} de ${mes} a las ${(String(hora).split('').length > 2) ? String(hora).split('.')[0] + ':30' : hora + ':00'}  Servicio - ${servicio}`,
                    "vibrate": [100, 50, 100],
                    "image": "https://res.cloudinary.com/mas58/image/upload/v1721692094/usuariosPerfil/tmp-2-1721692094727_cfyyxz.jpg",
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

export const notificarAgenda = async () => {

    const fecha = moment().tz('America/New_York').format('DD/MM/YYYY').split('/');

    // se ejecuta 24Hrs
    const mes = Number(fecha[1]) - 1;
    const dia = Number(fecha[0]);
    const year = Number(fecha[2]);

    const req = {
        params: {
            dia,
            mes
        }
    }
    const res = {}

    const agendas = [];
    // req.params.dia = dia actual
    const consultAgenda = await getAgendaDay(req, res, 'server');
    // req.params.dia = dia siguiente
    req.params.dia = dia + 1;
    const consultAgenda2 = await getAgendaDay(req, res, 'server');
    if (consultAgenda !== false && consultAgenda.length > 0) {
        agendas.push(...consultAgenda)
    }
    console.log('consultAgenda2', consultAgenda2)
    if (consultAgenda2 !== false) {
        if (consultAgenda2.length > 0) {
            agendas.push(...consultAgenda2);
        }
    }

    if (agendas.length) {
        const mesFormat = moment([year, mes]).format('MMMM');
        agendas.forEach(element => {
            if (!element.correo) {
                return false;
            }
            if (element.mes !== mes) {
                return false;
            }
            // 10 - 1 === 9  = pasa ok 
            // 9 - 1 === 9  = pasa al else
            // 11 - 1 10 = 9
            if (Number(element.dia) - 1 === dia) {
                console.log('paso bien 1')
            } else {
                // 9 === 9 = true
                if (Number(element.dia) === dia) {
                    console.log('paso bien 2')
                } else {
                    return false;
                }
            };
            const numeroHora = formatTime(element.hora);

            const html = `
            <h1>Recordatorio DubeNails</h1>
            <p
            style="
            font-size: 18px;
            "
            >
            Tienes tu cita de ${element.servicio} para el dia ${element.dia} del mes de ${mesFormat} a las ${numeroHora} 
            <br/> <br/>
            Direccion: 50 Starling CT, henrico, 23229
            </p>
            `;
            // const correo = element.correo;
const correo = 'hernaysg@gmail.com';
            main(correo, '', html)
        })
    } else {
        return false;
    }
}


export const notificarAgendaDelete = async (servicio, dia, mes, hora, email) => {
    const mesFormat = moment([mes]).format('MMMM');
    const numeroHora = formatTime(hora);
    const html = `
            <h1>Recordatorio DubeNails</h1>
            <p
            style="
            font-size: 18px;
            "
            >
            Tu cita de ${servicio} del dia ${dia} del mes de ${mesFormat} a las ${numeroHora} se cancelo con exito!!!
            </p>
            `;
    // const correo = element.correo;
    console.log('emailssss', email)
    const correo = 'hernaysg@gmail.com';
    main(correo, '', html)
}