const { Configuracion } = require('../modules/configuracion');
//let conf = new Configuracion('conf.json');

class UserModel{
  constructor(c){
    let conf = (c) ? c: new Configuracion('conf.json');
  }
  static createUser(req,callback){

    const db=req.variables.database;
    const email=req.variables.email;
    const cripto=req.variables.criptografia;

    const passwordSha=cripto.sha3(req.body.password);
    
    const validationToken=cripto.stringRandom();
    
    let user={
      usuario:req.body.usuario,
      passwordSha:passwordSha,
      email:req.body.email,
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

    console.log(db);

    db.createUser(user,(err)=>{
      const validationUrl=`http://localhost:8085/user/validate/${user.usuario}/${validationToken}`;
      console.log(validationUrl);
      email.send(user.email,"Validación de Cuenta",validationUrl,(err,info)=>{
         callback(err);
      })
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