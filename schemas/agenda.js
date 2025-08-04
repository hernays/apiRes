import  mongoose from "mongoose";

const { Schema , model } = mongoose;

const SchemaAgenda = Schema({
    nombre:{
        type: String,
        required:[true , ' el nombre es obligatorio']
    },
    dia : {
        type: String,
        required:[true , 'el dia es obligatorio']
    },
    hora : {
        type: Number,
        requied : [true , 'la hora es requerida']
    },
    mes:{
        type: Number,
        required:[true , 'el servicio es requerido']
    },
    servicio:{
        type: String,
        required:[true , 'el servicio es requerido']
    },
    tramo:{
        type:Number,
        requied:[true, 'el tramo es requerido']
    },
    telefono:{
        type:String,
        requied:false,
        default:null
    },
    correo:{
        type:String,
        requied:false,
        default:null
    },
    valor:{
        type:Number,
        requied:false,
        default:null
    },
    diaHabilitado:{
        type:Boolean,
        requied:false,
        default:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required: false,
        default:null
    },
    nuevo:{
        type:Boolean,
        required:false,
        default:true
    },
    token: {
        type: String,
        requied: false,
        default: null
    },
    estado:{
    type:Boolean,
    required : false,
    default : false
    }
})

export const SchemaAgendas = model('agenda',SchemaAgenda);