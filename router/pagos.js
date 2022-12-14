import express from 'express';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import FormData from 'form-data';
import { v4 } from 'uuid';
import { SchemaAgendas } from '../schemas/agenda.js';
const routerPagos = express();

routerPagos.post('/confirmacion', (req, res) => {
    res.status(200).send('ok');
})

routerPagos.get('/generar/:correo/:tokenUsuario/:mes/:dia/:hora', async (req, res) => {
    const { correo , tokenUsuario , mes , dia , hora} = req.params;
    if (correo === undefined) {
        return res.status(400).json({
            msg: 'correo invalido o formato invalido'
        })
    }

    const apiKey = process.env.API_KEY;
    const currency = 'CLP';
    const orden = v4();

    const payloadFlow = {
        apiKey,
        amount: 3000,
        commerceOrder: orden,
        subject: 'Detalle Servicio',
        currency,
        email: correo,
        timeout: 600,
        urlConfirmation: 'http://www.dubenails.xyz:1000/api/pagos/confirmacion',
        urlReturn: `https://www.dubenails.xyz/confirmacion/${tokenUsuario}/${mes}/${dia}/${hora}`
    }

    const data = firmaFLow(payloadFlow);

    try {
        const datos = await axios.post('https://sandbox.flow.cl/api/payment/create', data.bodyFormData,
            { headers: data.bodyFormData.getHeaders() });

        const { token, url, flowOrder } = datos.data;
        const urlRedirect = `${url}?token=${token}`;
        return res.status(200).json({ token , urlRedirect })
    } catch (error) {
        return res.status(400).json({ msg: error.response.data.message });
    }

});

routerPagos.post('/confirmar', async (req, res) => {

    const { token , id} = req.body;
    console.log("confirmar_token",token)
    const { s } = firmaFLow({
        apiKey: process.env.API_KEY,
        token
    })

    console.log('paso 1')

    const { data } = await axios.get('https://sandbox.flow.cl/api/payment/getStatus', {
        params: {
            apiKey: process.env.API_KEY,
            token,
            s
        }
    })
    console.log('paso 2')
    if (data.status === 2) {
        try{
            console.log('paso 3')
            const agenda = await SchemaAgendas.findByIdAndUpdate(id , {estado : true})
            return res.status(200).json({mes: 'pagook'})
        }catch(error){
            console.log('paso 4')
            return res.status(500).json({msg:'ocurrio un error en el servidor'})
        }
    } else {
        console.log('paso 5')
        const agenda = await SchemaAgendas.findByIdAndDelete(id)
        return res.status(200).json({ msg: 'pagonok' })
    }

})


const firmaFLow = (payloadFlow) => {
    const keySorted = Object.keys(payloadFlow).sort();
    let sign = '';

    keySorted.forEach(key => {
        sign += (key + payloadFlow[key])
    })

    const hash = CryptoJS.HmacSHA256(sign, process.env.SECRET_KEY).toString();
    payloadFlow['s'] = hash;
    const s = hash;
    const bodyFormData = new FormData();
    const keyPayload = Object.keys(payloadFlow);
    keyPayload.forEach(key => {
        bodyFormData.append(key, payloadFlow[key])
    })
    return {
        s,
        bodyFormData
    }
}

export default routerPagos;