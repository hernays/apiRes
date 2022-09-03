import  'dotenv/config';
import  express        from 'express';
import  cors           from 'cors';
import  { conexionDB } from '../DB/connect.js';
import  routerUsuario  from '../router/usuarios.js';
import  routerAuth     from '../router/auth.js';
import  routerAgenda    from '../router/agenda.js'


export class Server {
    constructor(){
        this.app        = express();
        this.conexionDb = conexionDB;
        this.middlewares();
        this.router();
    }

    middlewares(){
        this.app.use( cors() );
        this.app.use( express.json() );
    }

    router(){
        this.app.use( express.static('public'));
        this.app.use('/api' , routerUsuario );
        this.app.use('/auth' , routerAuth );
        this.app.use('/agenda' , routerAgenda );
    }

    iniciar(){
        this.app.listen(process.env.PORT || 1000, () => {
            console.log('Server Corriendo en el puerto ', process.env.PORT);
        });
        this.conexionDb();
    }
}