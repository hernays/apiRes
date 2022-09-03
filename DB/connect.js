import mongoose from 'mongoose';

export const conexionDB = async () => {
    mongoose.connect( 'mongodb+srv://user_global:xKr18tDUs7Ni2sc8@micluster58.ibgsw.mongodb.net/test' ).then( 
        console.log('conexcion a MongoDB Exitosa')
        ).catch((err) => {console.log('falla al conectar DATABASE: ',err) })
}

