const validator = require('validator');

const { Respuestas } = require('../modules/respuestas');
const { Database } = require('../modules/database');
const { Configuracion } = require('../modules/configuracion');

const conf = new Configuracion('conf.json');

const db = new Database(conf).getDb();

class Validacion {

  static validar(req, res, next) {
    let msg;
    let keys;
    let values;

    // Se obtienen todas las claves y valores de los parámetros enviados por el usuario.
    // Para peticiones de tipo GET habría que utilizar req.params o req.query
    //console.log(req.query);
    //Tipo de petición
    if (req.method === "GET") {
      keys = Object.keys(req.params)
      values = Object.values(req.params)
    } else {
      keys = Object.keys(req.body)
      values = Object.values(req.body)
    }
    //console.log(keys);
    //console.log(values);
    // Se iteran todos los parámetros hasta el final o hasta que alguna de las funciones validadoras devuelva un string
    // Es necesario tener en cuenta qué sucedería si el usuario envía una cantidad ingente de parámetros
    for (let i = 0; i < keys.length && !msg; i++) {

      // Se guarda el nombre del parámetro en una variable
      let parameter = keys[i];

      // Se comprueba si existe un método validador para ese parámetro
      if (parameter in Validacion) {

        // Se ejecuta el método validador para el parámetro, obteniendo previamente el valor
        let value = values[i];
        msg = Validacion[parameter](req, value);
      }
    }

    if (msg) {
      res.json(Respuestas.error(msg));
      return;
    }
    next();
  }

  static coinName(req, value) {
    const coins = req.variables.coins;

    if (coins.indexOf(value.toUpperCase()) === -1) {
      return "La moneda no existe";
    }
  }

  static username(req, value) {
    if(!validator.isAlphanumeric(value)){
      return "El nombre de usuario debe de ser Alfanumérico";
    }

    if((value.length<3) || (value.length>20)){
      return "La longitud del usuario debe de estar comprendida entre 3 y 20 caracteres";
    }
  }
  

  static password(req, value) {
    if(!validator.matches(value,/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)){
      return "La contraseña debe incluir más cosas";
    }
  }

  static email(req, value) {
    if(!validator.isEmail(value)){
      return "El formato del email no es correcto";
    }
  }
/*
  static tokenRegistro(req, value) {
    const tokenRegistro = req.params.tokenRegistro;
    //console.log(`validando token: ${tokenRegistro}`);
    const users=[];
    let validado=false;

    db.getUsers((err,users)=>{
      //console.log(users);
      this.users=users;
    });

    for (let user of this.users){
      console.log(user);
      if(user.tokenRegistro === req.params.tokenRegistro){
        console.log('token ok');
        validado=true;
      }
    }
    console.log(validado);
    if(!validado) return "No existe el token introducido";
  }
  */

}

module.exports = {
  Validacion
}