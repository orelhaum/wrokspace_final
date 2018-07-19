//const { Configuracion } = require('../modules/configuracion');
//let conf = new Configuracion('conf.json');
let validator = require('validator')

class UserModel{
  constructor(c){
    //let conf = (c) ? c: new Configuracion('conf.json');
  }
  static generateModel(mongoose) {

    let schema = new mongoose.Schema({
      usuario: {
        type: String,
        required: [true, 'Usuario es obligatorio.'],
        unique:[true,'No se puede utilizar el usuario {VALUE}, ya está en uso.']
      },
      passwordSha: {
        type: String
      },
      realCash : {
        type: Number
      },
      activado: {
        type: Boolean
      },
      tokenRegistro: {
        type: String
      },
      baneado : {
        type: Boolean
      },
      email: {
        type: String,
        validate: {
          validator: function(v) {
            return validator.isEmail(v);
          },
          message: '{VALUE} no es un email válido!'
        },
        required: [true, 'Email requerido']
      },
      fechaNacimiento: {
        type: Date,
        validate: {
          validator: function(v) {
            console.log(v);
            let fechaMayorEdad=new Date();
            fechaMayorEdad.setYear(fechaMayorEdad.getFullYear()-18);
            console.log(fechaMayorEdad);
            return v>fechaMayorEdad; //validator.isAfter(v,fechaMayorEdad);
          },
          message: '{VALUE} no es mayor de 18 años!'
        },
        required: [true, 'Fecha nacimiento requerida']
      },
      lenguaje: {
        type: String
      },
      prefijoTelefonoMovil: {
        type: Number
      },
      tipo: {
        type: String
      },
      dni: {
        type: String
      },
      tarjetaVisa: {
        type: Number
      },
      dniFoto: {
        type: String
      },
      loginIp: {
        type: String
      },
      registroIp: {
        type: String
      },
      registroIp: {
        type: Date
      },
      ventas: {
        type: [{
          moneda: {
            type: Number
          },
          cantidad: {
            type: Number
          },
          precioMoneda: {
            type: Number
          },
          date: {
            type: Date
          },
        }]
      },
      compras: {
        type: [{
          moneda: {
            type: Number
          },
          cantidad: {
            type: Number
          },
          precioMoneda: {
            type: Number
          },
          date: {
            type: Date
          },
        }]
      },
      date: {
        type: Date
      }
    }, { collection: 'users', versionKey: false});

    return mongoose.model('User', schema);
  }

  static createUser(req,callback){

    const db=req.variables.database;
    const email=req.variables.email;
    const cripto=req.variables.criptografia;

    const passwordSha=cripto.sha3(req.body.password);
    
    const validationToken=cripto.stringRandom();
    
    let user={
      usuario:req.body.username,
      passwordSha:passwordSha,
      email:"req.body.email@gmail.com",
      fechaNacimiento:"2015-05-06",
      activado:false,
      baneado:false,
      tipo:"registrado",
      realCash:5,
      ventas:[],
      compras:[],
      fondos:{},
      recibidos:[],
      enviados:[],
      tokenRegistro:validationToken
    }

    db.createUser(user,(err)=>{
      console.log('creando usuario');
      const validationUrl=`http://localhost:8085/user/validate/${user.usuario}/${validationToken}`;
      console.log(validationUrl);
      /*
      email.send(user.email,"Validación de Cuenta",validationUrl,(err,info)=>{
         callback(err);
      })*/
      callback(err);
    });
  }

  static validateUser(req,callback){
    const token=req.params.tokenRegistro;
    const usuario=req.params.usuario;

    const db= req.variables.database;

    db.getUser(usuario,(err,usuarioDb)=>{
      if(err) return callback(err);
      if(token === usuarioDb.tokenRegistro){
        return callback();
      }
      return callback("El token de validación no es correcto")
    })
  }

  static loginUser(req,callback){

    const db= req.variables.database;
    const cripto=req.variables.criptografia;

    const passwordSha=cripto.sha3(req.body.password)
    const usuario=req.body.usuario;

    db.getUser(usuario,(err,usuarioDb)=>{
      if(err) return callback(err);
      if(usuarioDb==undefined) return callback("Usuario incorrecto");
      if(passwordSha === usuarioDb.passwordSha){
        return callback();
      }
      return callback("Contraseña incorrecta");
    })
  }
}

module.exports = { UserModel }