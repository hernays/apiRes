import mongoose from "mongoose";


const { Schema, model } = mongoose;



const SchemaUsuarios = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: false,
    },
    correo: {
        type: String,
        required: [false, 'El correo es obligatorio'],
        unique: true,
    },
    telefono: {
        type: Number,
        required: [false, 'El telefono es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true
    }
});


export const SchemaUsuarioRegister = model('UsuarioRegister', SchemaUsuarios);