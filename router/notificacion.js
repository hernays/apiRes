import express from 'express';
import { saveNotify } from '../controllers/notificacion.controllers.js';

const routerNotificacion = express();

routerNotificacion.post('/:id', saveNotify)

export default routerNotificacion;