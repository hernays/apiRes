import  express  from "express";
import { check } from "express-validator";
import { validarCampos, validarhora } from "../helpers/validarCampos.js";
import {  actualizarVista, borrarHoras, borrarMes, buscarIdUsuario, getAgenda, getAgendaDay, guardarAgenda, habilitarDia, totalMes } from '../controllers/agenda.controllers.js';
import { validarUsuarioConectado } from "../helpers/jwt.js";

const routerAgenda = express();

routerAgenda.post('/save' ,[
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('hora' , 'la hora es obligatoria').not().isEmpty().custom(validarhora),
    check('servicio' , 'el servicio es obligatorio').not().isEmpty(), 
    check('horaServicio', 'el tramo es invalido').isNumeric(),
    check('dia', 'el dia el obligatorio').not().isEmpty(),
    validarCampos,
    validarUsuarioConectado
], guardarAgenda)
routerAgenda.get('' , [validarUsuarioConectado], getAgenda)
routerAgenda.post('/estado' ,[validarUsuarioConectado], actualizarVista)
routerAgenda.get('/:dia/:mes'  , [validarUsuarioConectado],getAgendaDay)
routerAgenda.delete('/borrar'  ,[validarUsuarioConectado], borrarMes)
routerAgenda.post('/borrarHora',[validarUsuarioConectado], borrarHoras)
routerAgenda.get('/:dia/:mes/:habilitar', [validarUsuarioConectado],habilitarDia);
routerAgenda.get('/:mes', [validarUsuarioConectado], totalMes);
routerAgenda.get('/:id/:mes/:dia/:hora', [validarUsuarioConectado], buscarIdUsuario)


export default routerAgenda;
