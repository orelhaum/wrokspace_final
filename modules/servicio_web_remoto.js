const request = require('request');

const { Configuracion } = require('./configuracion');
const { CONSTANTES_URL,CONSTANTES_CONF } = require('./constantes');


//let conf = new Configuracion('conf.json');

/************* Autenticación *************/
/*
const domain = "http://192.168.1.74:8085";
const domain_ws = "ws://192.168.1.74:8086";
const objetoAutenticacion = {
  username: "alejandro", 
  token: "c5738c3482d2e055939ad8741f4974c93f9c7e18b2f7f74e0ade246d74ae30bbab2d2e0efde761ba"
}
*/
class Http {
	constructor() {
        console.log('Se invoca al constructor de la clase Http')
  }
  sendHttp(method, url, body, callback) {
    const options={ method, body };

   request(url,options,(err,res,msg)=>{
     if(err) console.log(`hay un error ${err}`);
     this.postHttp(JSON.parse(msg), callback);
   });
  }
}

class ServicioWeb extends Http {
  constructor(c) {
    super();
    let conf = (c) ? c: new Configuracion('conf.json');
    this.token=conf.get(CONSTANTES_CONF.servicio_web_remoto_token); // objetoAutenticacion.token;
    this.username=conf.get(CONSTANTES_CONF.servicio_web_remoto_username); // objetoAutenticacion.username;

    console.log('Se invoca al constructor de la clase ServicioWeb')
  }

  preHttp(method, url, bodyObject, callback) {

    if (method!=='GET'){
      //Peticiones que no son del tipo GET
      bodyObject.token=this.token; // objetoAutenticacion.token;
      bodyObject.username=this.username; // objetoAutenticacion.username;
    }
    this.sendHttp(method, url, JSON.stringify(bodyObject), callback);
  }

  postHttp(jsonData, callback){
    if (jsonData.ok) {
      //console.log('dentro de posthrrp')
      callback(undefined, jsonData.data)
    }
    else {
      callback(jsonData.msg)
    }
  }

  coins(callback) {
    console.log("Toma los datos del servidor (monedas)")
    this.preHttp(CONSTANTES_URL.methodCoins, CONSTANTES_URL.urlCoins, undefined, callback);
  }

  market(nombreMoneda, callback) {
    let url = CONSTANTES_URL.urlMarket.replace(":coin", nombreMoneda);
    this.preHttp(CONSTANTES_URL.methodMarket, url, undefined, callback);
  }
  
  historical(nombreMoneda, numeroHoras, callback) {
    let url = CONSTANTES_URL.urlHistorical.replace(":coin", nombreMoneda).replace(":hours", numeroHoras);
    this.preHttp(CONSTANTES_URL.methodMarket, url, undefined, callback);
  }
  
  prediction( numeroHoras, callback) {
    let url = CONSTANTES_URL.urlPrediction.replace(":hours", numeroHoras);
    this.preHttp(CONSTANTES_URL.methodPrediction, url, undefined, callback);
  }
  
  infoUsers(callback) {
    this.preHttp(CONSTANTES_URL.methodInfoUser, CONSTANTES_URL.urlInfoUser, undefined, callback);
  }
  
  funds(callback) {
    let bodyObject = {
    }
    this.preHttp(CONSTANTES_URL.methodFunds, CONSTANTES_URL.urlFunds, bodyObject, callback);
  }
  
  buy(nombreMoneda, percentCantidad, callback) {
    let url = CONSTANTES_URL.urlBuy.replace(":coin", nombreMoneda).replace(":cantidad", percentCantidad);
    let bodyObject = {
    }
    this.preHttp(CONSTANTES_URL.methodBuy, url, bodyObject, callback);
  }
  
  sell(nombreMoneda, percentCantidad, callback) {
    let url = CONSTANTES_URL.urlSell.replace(":coin", nombreMoneda).replace(":cantidad", percentCantidad);
    let bodyObject = {
    }
    this.preHttp(CONSTANTES_URL.methodSell, url, bodyObject, callback);
  }
  
  list(usuario, callback) {
    let bodyObject = {
    }
    this.preHttp(CONSTANTES_URL.methodList, CONSTANTES_URL.urlList, bodyObject, callback);
  }
  
  send(destinationUser, message, callback) {
    let bodyObject = {
      destination_user: destinationUser,
      message: message
    }
    this.preHttp(CONSTANTES_URL.methodSend, CONSTANTES_URL.urlSend, bodyObject, callback);
  }
  
  read(idMessage, callback) {
    let url = CONSTANTES_URL.urlRead.replace(":idMessage", idMessage);
    let bodyObject = {
    }
    this.preHttp(CONSTANTES_URL.methodRead, url, bodyObject, callback);
  }
  
  remove(idMessage, callback) {
    let url = CONSTANTES_URL.urlMsgRemove.replace(":idMessage", idMessage);
    let bodyObject = {
    }
    this.preHttp(CONSTANTES_URL.methodMsgRemove, url, bodyObject, callback);
  }
  
  removeAll(callback) {
    let bodyObject = {
    }
    this.preHttp(CONSTANTES_URL.methodMsgRemoveAll, urlMsgRemoveAll, bodyObject, callback);
  }  
}


module.exports = { ServicioWeb };

/*
let sw = new ServicioWeb();
sw.coins(function(err, monedas) {
   console.log(monedas);
});
*/

