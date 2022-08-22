import mongoose from 'mongoose';

const { model , Schema } = mongoose;


const SchemaRol = Schema({
    rol: {
        type: String
    },
    role: {
        type: String
    }
});

export const SchemaRole =  model( 'rol' , SchemaRol );


