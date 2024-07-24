import moment from "moment";
import { SchemaArticulo } from '../schemas/articulos.js';
import { SchemaUsuario } from "../schemas/usuarios.js";
import { SchemaNotify } from "../schemas/notify.js";
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';
import webpush from 'web-push';
moment().locale('es');

export const guardarArticulos = async (req, res) => {

    if (req.files === null) {
        return res.status(400).json({ msg: 'La imagen es requerida' })
    }

    const { id, descripcion, fecha, nombre } = req.body;

    const usuario = id;
    const { tempFilePath, name } = req.files.archivo;
    const { mimetype } = req.files.archivo;
    if (mimetype !== 'image/jpg' && mimetype !== 'image/png' && mimetype !== 'image/jpeg'
        && mimetype !== 'image/gif' && mimetype !== 'image/HEIC' && mimetype !== 'image/webp'
        && mimetype !== 'image/avif' && mimetype !== 'image/heic' && mimetype !== 'application/octet-stream') {
        return res.status(400).json({
            msg: 'la extension no es valida'
        })
    }
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'articulos',
        format: 'jpg',
        use_filename: true,
        transformation: {
            width: 600,
            height: 500
        }
    })

    //How to get the image and upload it to cloudinary

    try {
        const articulo = await SchemaArticulo.create({ usuario, descripcion, fecha, nombre, img: secure_url });
        notify();
        return res.status(200).json(
            articulo
        )

    } catch (error) {
        console.log('error', error)
    }
}

export const listarArticulos = async (req, res) => {

    const { limit } = req.params;

    try {
        const articulos = await SchemaArticulo.find().sort({ $natural: -1 }).limit(Number(limit))
            .populate(
                {
                    "path": 'usuario',
                    "select": 'nombre apellido rol'
                }
            )
        if (articulos.length === 10) {
         const articulo = await SchemaArticulo.findByIdAndDelete(articulos[9]._id);
        if (articulo.img) {
            const imgSplit = articulo.img.split('/');
            const imgId = imgSplit[imgSplit.length - 1].split('.');
            cloudinary.uploader.destroy('articulos/' + imgId[0])
        }
        }
       return res.status(200).json(
            articulos
        )
    } catch (error) {
        res.status(500).json({
            msg: "error 500"
        })
    }
}


export const borrarArticulos = async (req, res) => {

    const { id } = req.params;

    try {
        const articulo = await SchemaArticulo.findByIdAndDelete(id);
        if (articulo.img) {
            const imgSplit = articulo.img.split('/');
            const imgId = imgSplit[imgSplit.length - 1].split('.');
            cloudinary.uploader.destroy('articulos/' + imgId[0])
        }
        return res.status(200).json({
            articulo
        })

    } catch (error) {
        res.status(500).json({
            msg: 'error 500'
        })
    }

}



const notify = async () => {

    const usuariosAdmin = await SchemaUsuario.find();
    const usuariosAnonimos = await SchemaNotify.find();

    for (let usuarios of usuariosAnonimos) {
        const datos = {
            notify: {
                endpoint: usuarios.endpoint,
                auth: usuarios.auth,
                p256dh: usuarios.p256dh
            }
        }
        usuariosAdmin.push(datos)
    }

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

            const payload = {
                "notification": {
                    "title": "DubeNails",
                    "body": "Nuevo contenido disponible",
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