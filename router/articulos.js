import  express  from "express";
import { check } from "express-validator";
import { guardarArticulos, listarArticulos } from "../controllers/articulos.controllers.js";
import { validarCampos, validarhora } from "../helpers/validarCampos.js";

const routerArticulos = express();

routerArticulos.post('', guardarArticulos )
routerArticulos.get('', listarArticulos )

/* routerAgenda.post('/save' ,[
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
routerAgenda.post('/borrarHora', borrarHoras) */

export default routerArticulos;
