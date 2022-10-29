import  Mongoose  from "mongoose";
const { Schema , model } = Mongoose;

const schemaNotify = Schema({
  p256dh :{
        type:String,
        required : true
      },
      endpoint:{
        type: String,
        required : true
      },
      auth:{
        type: String,
        required : true
      },
      usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required: false,
        default:null
      }
});


export const SchemaNotify = model('Notify' , schemaNotify);