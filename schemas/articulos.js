import  mongoose from "mongoose";

const { Schema , model } = mongoose;

const SchemaArticulos = Schema({
    nombre:{
        type: String,
        required:[true , ' el nombre es obligatorio']
    },
    descripcion:{
        type:String,
        required:[true,'el articulo es requerido'],
        default: null
    },
    img:{
      type:String,
      required:[true,'la imagen es obligatoria'],
      default:null
    },
    fecha:{
     type: String,
     required:[true,'la fecha es requerida'],
     default:null
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:[true,'el usuario es obligatorio'],
        default:null
    }
})

export const SchemaArticulo = model('articulo',SchemaArticulos);