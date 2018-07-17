const nodemailer= require('nodemailer');

const { Configuracion } = require('./configuracion');
const { CONSTANTES_URL,CONSTANTES_CONF } = require('./constantes');

class Email{
  constructor(c){
    let conf = (c) ? c: new Configuracion('conf.json');

    this.transporter=nodemailer.createTransport(
      {
      service:conf.get(CONSTANTES_CONF.email_server),
      auth:{
        user:conf.get(CONSTANTES_CONF.email_account),
        pass:conf.get(CONSTANTES_CONF.email_password)
      }
    });
  }
  
  send(to,subject,text,callback){
    const mailOptions={
      from:conf.get(CONSTANTES_CONF.email_account),
      to,
      subject,
      text
    }
    this.transporter.sendMail(mailOptions,callback);
  }
}

module.exports = { Email }