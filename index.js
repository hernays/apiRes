/* import  { Server }  from "./modelos/server.js";


const server = new Server();

server.iniciar(); */

import express from 'express';

const app = express();

app.get('/' , (req , res) => {
    console.log('alguien entro')
    res.send('hola mundo')
})
app.listen( 4000, () => {

    console.log('servidor ok')
})