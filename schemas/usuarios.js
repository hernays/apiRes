import mongoose from "mongoose";


const { Schema, model } = mongoose;



const SchemaUsuarios = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    apellido: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio'],
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
    },
    telefono: {
        type: Number,
        required: [true, 'El telefono es obligatorio'],
    },
    rol: {
        type: String,
        require: [true, 'El rol es requerido'],
    },
    image: {
        type: String,
        require: false,
        default: null
    },
    google: {
        type: Boolean,
        default: false,
    },
    estado: {
        type: Boolean,
        default: true
    },
    notify: {
        required: false,
        p256dh: {
            type: String,
            required: false
        },
        endpoint: {
            type: String,
            required: false
        },
        auth: {
            type: String,
            required: false
        }
    }
});


export const SchemaUsuario = model('Usuario', SchemaUsuarios);