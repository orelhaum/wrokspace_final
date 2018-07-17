const SHA3 = require('js-sha3');
const CRYPTO = require('crypto');
const RANDOMSTRING= require('randomstring');

const { Configuracion } = require('./configuracion');
const { CONSTANTES_CONF } = require('./constantes');

//let conf = new Configuracion('conf.json');

class Criptografia{
  constructor(c){

    let conf = (c) ? c: new Configuracion('conf.json');

    this.clave=conf.get(CONSTANTES_CONF.criptografia_clave);
    this.algoritmo=conf.get(CONSTANTES_CONF.criptografia_algoritmo);
  }

  sha3(data) {
    return SHA3.sha3_512(data);
  }

  cifrar(data,clave=this.clave,algoritmo=this.algoritmo){

    let cipher = CRYPTO.createCipher(algoritmo,clave);
    let crypted = cipher.update(data,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  descifrar(dataCifrados,clave=this.clave,algoritmo=this.algoritmo){
    let decipher = CRYPTO.createDecipher(algoritmo,clave);
    let deccrypted = decipher.update(dataCifrados,'hex','utf8');
    deccrypted += decipher.final('utf8');
    return deccrypted;
  }

  stringRandom(longitud=20){
    return RANDOMSTRING.generate(longitud);
  }

}

module.exports = { Criptografia }