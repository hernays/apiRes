import  'dotenv/config';
import  express        from 'express';
import  cors           from 'cors';
import  { conexionDB } from '../DB/connect.js';
import  routerUsuario  from '../router/usuarios.js';
import  routerAuth     from '../router/auth.js';
import  routerAgenda    from '../router/agenda.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';


export class Server {
    constructor(){
        this.app        = express();
        this.conexionDb = conexionDB;
        this.middlewares();
        this.router();
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = dirname(this.__filename);
    }

    middlewares(){
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use( express.text() )
    }

    router(){
        console.log('1que paso')
        this.app.use( express.static('public'));
        this.app.use('/api' , routerUsuario );
        this.app.use('/api/auth' , routerAuth );
        this.app.use('/api/agenda' , routerAgenda );
        this.app.get('/*', ( req ,res ) => {
             res.sendFile(this.__dirname.replace('/modelos', '') + '/public/index.html')
        })
    }

    iniciar(){
        this.app.listen(process.env.PORT || 1000, () => {
            console.log('Server Corriendo en el puerto ', process.env.PORT);
        });
        this.conexionDb();
    }
}