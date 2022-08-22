import mongoose from 'mongoose';



export const conexionDB = async () => {
    mongoose.connect( process.env.URLDB ).then( 
        console.log('conexcion a MongoDB Exitosa')
        ).catch((err) => {console.log('falla al conectar DATABASE: ',err) })
}

