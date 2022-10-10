import  express  from "express";
import { check } from "express-validator";
import { validarCampos, validarhora } from "../helpers/validarCampos.js";
import {  borrarHoras, borrarMes, getAgenda, getAgendaDay, guardarAgenda } from '../controllers/agenda.controllers.js';

const routerAgenda = express();

routerAgenda.post('/save' ,[
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('hora' , 'la hora es obligatoria').not().isEmpty().custom(validarhora),
    check('servicio' , 'el servicio es obligatorio').not().isEmpty(), 
    check('horaServicio', 'el tramo es invalido').isNumeric(),
    check('dia', 'el dia el obligatorio').not().isEmpty(),
    validarCampos
], guardarAgenda)
routerAgenda.get('' , getAgenda)
routerAgenda.get('/:dia/:mes' , getAgendaDay)
routerAgenda.delete('/borrar' , borrarMes)
routerAgenda.post('/borrarHora', borrarHoras)

export default routerAgenda;
