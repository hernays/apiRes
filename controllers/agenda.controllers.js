import { SchemaAgendas } from "../schemas/agenda.js";
import moment from "moment";

moment().locale('es');
export const guardarAgenda = async(req , res) => {

    const { nombre , servicio , dia , hora , horaServicio , telefono , mes} = req.body;
       const tramo = hora + horaServicio;
       console.log(mes)
    try{
        const agenda = new SchemaAgendas({
            nombre , servicio, dia, hora , mes , tramo , telefono
        })
    
        agenda.save();
        res.status(200).json({
            msg: 'agenda registrada con exito!!!'
        })
    }catch(err){
         res.status(500).json({msg: 'error en el servidor'})
    }
}

export const getAgenda = async(req ,res) => {

    try{
   
        const agenda = await SchemaAgendas.find();
        
        if(agenda.length === 0) return res.status(400).json({
            msg:'No se encontraron registros.'
        })
        
        res.status(200).json({
            agenda
        })
    }catch(err){
        console.log(' error')
        res.status(500).json({msg:'error en el servidor'})
    }

}

export const getAgendaDay = async(req ,res) => {

    const { dia , mes } = req.params;
    try{
        const agenda = await SchemaAgendas.find({dia : dia , mes : mes});
        
        console.log(agenda)
        if(agenda.length === 0) return res.status(400).json({
            msg:'No se encontraron registros.'
        })
        
        return res.status(200).json({
            agenda
        })
    }catch(err){
        console.log(' error')
        res.status(500).json({msg:'error en el servidor'})
    }

}

export const borrarMes = async( req , res) => {
    const { mes } = req.body;

    try{
        const agenda = await SchemaAgendas.remove({mes : mes})
        res.status(200).json({msg:'borrado con exito'})
    }catch(err){
        res.status(500).json({msg : 'error en el servidor'})
    }
}

export const borrarHoras = async(req , res) => {

    const { nombre , dia } = req.body;
    try{
        const agenda = await SchemaAgendas.deleteOne({nombre: nombre , dia: dia})
        res.status(200).json({msg: 'agenda eliminada con exito'});
    }catch(err){
      res.status(500).json({msg:'error en el servidor'})
    }

}