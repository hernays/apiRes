import  mongoose from "mongoose";


const { Schema , model } = mongoose;



const SchemaUsuarios = Schema( {
    nombre: {
        type: String,
        required: [ true , 'el nombre es obligatorio'],
    },
    apellido: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: [ true , 'la contraseña es obligatorio'],
    },
    correo: {
        type: String,
        required :[ true , 'el correo es obligatorio'],
        unique: true,
    },
    direccion: {
        type: String,
        required: [ true , 'la dirección es obligatoria'],
    },
    telefono: {
        type: Number,
        required: [ true , 'el telefono es obligatorio'],
    },
    rol: {
        type : String,
        require: [true , 'el rol es requerido'],
    },
    google :{
        type : Boolean,
        default : false,
    },
    estado : {
        type: Boolean,
        default : true
    }
});


export const SchemaUsuario = model('Usuario' , SchemaUsuarios);