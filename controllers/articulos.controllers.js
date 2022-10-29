import moment from "moment";
import {SchemaArticulo} from '../schemas/articulos.js';
import {v2 as cloudinary}  from 'cloudinary'; 
import  axios  from 'axios';
import webpush from 'web-push';
moment().locale('es');

export const guardarArticulos = async(req , res) => {

    if(req.files === null){
        return res.status(400).json({msg:'La imagen es requerida'})
      }

    const { id , descripcion , fecha , nombre} = req.body; 
    console.log('id',id)
    const usuario = id;
    const { tempFilePath , name } = req.files.archivo;
    const { mimetype } = req.files.archivo;
    if(mimetype !== 'image/jpg' && mimetype !== 'image/png' && mimetype !== 'image/jpeg'
    && mimetype !== 'image/gif' && mimetype !== 'image/HEIC' && mimetype !== 'image/webp'
    && mimetype !== 'image/avif' && mimetype !== 'image/heic' && mimetype !== 'application/octet-stream'){
       return res.status(400).json({
          msg:'la extension no es valida'
       })
    }

    const { secure_url }  = await cloudinary.uploader.upload(tempFilePath ,{
        folder: 'articulos',
        format: 'jpg',
        use_filename: true,
        transformation:{
            width:600,
            height:280
        }
    })
    console.log("img",secure_url)
    try{
        const articulo = await SchemaArticulo.create({usuario , descripcion , fecha , nombre , img : secure_url});
      /*   if(articulo.img){
            const imgSplit = articulo.img.split('/');
            const imgId = imgSplit[imgSplit.length - 1].split('.');
             cloudinary.uploader.destroy(imgId[0]);
            } */

        res.status(200).json(
            articulo
        )

/*         axios.get('https://dubenails.xyz/articulo',{
            nuevo :'articulo'
          }).then((data) => console.log('aqui llego ok', data))
          .catch((error) => console.log('erroreee', error));

           */

    }catch(error){
 console.log('error', error)
    }
}

export const listarArticulos = async(req, res) => {

    try{
        const articulos = await SchemaArticulo.find()
        .populate(
            {
                "path":'usuario',
                "select":'nombre apellido rol'
            }
        )

        res.status(200).json(
            articulos
        )
    }catch(error){
     res.status(500).json({
        msg:"error 500"
     })
    }
}


export const borrarArticulos = async(req , res) => {

    const { id } = req.params;

    try{
        const articulo = await SchemaArticulo.findByIdAndDelete(id);
          if(articulo.img){
            const imgSplit = articulo.img.split('/');
            const imgId = imgSplit[imgSplit.length - 1].split('.');
             cloudinary.uploader.destroy('articulos/'+imgId[0])
            } 
        res.status(200).json({
            articulo
        })

    }catch(error){
      res.status(500).json({
        msg:'error 500'
      })
    }

}