import pkg from 'nodemailer';

export const main = (correoCliente, jwt, html2) => {
  const transporter = pkg.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "soporte@dubenails.com",
      pass: "Capitan5121@",
    }
  });

  let html = `

    <!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<div
style="
display: block;
width: 100%;
text-align: center;
margin: 0px auto;
"
>
<img width="180px" height="auto" src="https://res.cloudinary.com/mas58/image/upload/v1721692094/usuariosPerfil/tmp-2-1721692094727_cfyyxz.jpg" alt="">
    <h1
    style="
    border-bottom: 2px solid black;
    text-align: center;
    "
    >Recuperación de contraseña</h1>
    <p style="
    font-size: 16px;
    z-index: 1;
    ">Ingresa al link actualizar tu contraseña</p>
    <a style="
    font-size: 16px;
    " href="https://dubenails.com/recuperar/${jwt}"> Click para Actualizar contraseña</a>
</div>
</body>
</html>
    
                `
  if(jwt === ''){
    html = html2
  }


  console.log('htnml', html)
  console.log('correo', correoCliente)

  // async..await is not allowed in global scope, must use a wrapper
  let mailOptions = {
    from: 'soporte@dubenails.com',
    to: correoCliente,
    subject: 'DubeNails',
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Correo enviado: ' + info.response);
  });
}

