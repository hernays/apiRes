import express, { json } from 'express';
import  'dotenv/config';
import cors from 'cors';
import { conexionDB } from '../DB/connect.js';

import routerUsuario from '../router/usuarios.js';
import  routerAuth  from '../router/auth.js';


export class Server {

    constructor(){

        this.app = express();
        this.puerto = process.env.PUERTO;
        this.conexionDb = conexionDB;

        this.middlewares();
        this.router();

    }

    middlewares(){
        this.app.use( cors() );
        this.app.use( express.json() );
    }

    router(){
        this.app.use('/api' , routerUsuario );
        this.app.use('/auth' , routerAuth );
    }


    iniciar(){

        this.app.listen( this.puerto , () => {
            console.log('Server Corriendo en el puerto ', this.puerto);
        });

        this.conexionDb();
    }
}