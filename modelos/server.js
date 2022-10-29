import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { conexionDB } from '../DB/connect.js';
import routerUsuario from '../router/usuarios.js';
import routerAuth from '../router/auth.js';
import routerAgenda from '../router/agenda.js'
import routerArticulos from '../router/articulos.js';
import fileupload from 'express-fileupload';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// test

import webpush from 'web-push';
import routerNotificacion from '../router/notificacion.js';

export class Server {
    constructor() {
        this.app = express();
        this.conexionDb = conexionDB;
        this.middlewares();
        this.router();
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = dirname(this.__filename);
    }

    middlewares() {
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
            next();
        });
        this.app.use(cors());
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb' }));
        this.app.use(express.text());
        this.app.use(fileupload({
            useTempFiles: true,
            tempFileDir: '/tmp/'
        }));
    }

    router() {
        this.app.use(express.static('public'));
        this.app.use('/api', routerUsuario);
        this.app.use('/api/auth', routerAuth);
        this.app.use('/api/agenda', routerAgenda);
        this.app.use('/api/articulos', routerArticulos);
        this.app.use('/api/notificacion', routerNotificacion);

        this.app.post('/api/test', (req, res) => {

            const { endpoint } = req.body;
            const { auth , p256dh }  = req.body.keys;

            const vapidKeys = {
            publicKey:'BLbYE-LHO-H7zD53WcZ_KPYaLh6G70VrMiOngCSTp3P8boggr7T-NxNnIoh7RMpcRq9fWXHCI3MeyV9ACqezm_k',
            privateKey:'7Y6Td9C6xHFlhK3zeRb5hLK-3qya2PFhxm6Cs9gnyvc'
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
                endpoint ,
                expirationTime:null,
                keys: {
                    auth ,
                    p256dh 
                }
            }


            const payload = {
                     "notification":{
                        "title":"saludos",
                        "body":"desde el body",
                        "vibrate":[100,50,100],
                        "image": "https://cdn-icons-png.flaticon.com/512/1088/1088537.png",
                        "data":{
                            "dateOfArrival":Date.now(),
                            "primaryKey":1
                        },
                        "actions":[{
                            "action":"explore",
                            "title":"hernays"
                        }],

                     }
            }

            webpush.sendNotification(pushSubscription , JSON.stringify(payload))
            .catch(error => {console.log('error', error)})
            .then(exito => {
                console.log('extisosss' , exito)
                return res.status(200).json({ msg: 'notificado con exito' })
            })

        });
        this.app.get('/*', (req, res) => {
            res.sendFile(this.__dirname.replace('/modelos', '') + '/public/index.html')
        })

    }

    iniciar() {
        this.app.listen(process.env.PORT || 1000, () => {
            console.log('Server Corriendo en el puerto ', process.env.PORT);
        });
        this.conexionDb();
    }
}