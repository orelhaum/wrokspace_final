const { Database } = require('../modules/database');
const { Respuestas } = require('../modules/respuestas');
const { Configuracion } = require('../modules/configuracion');
const { Criptografia } = require('../modules/criptografia');
const { Email } = require('../modules/email');

const conf = new Configuracion('conf.json');


class Inicializacion{
  constructor(conf){
    this.db=new Database(conf).getDb();
    this.coins=null;
    this.db.getCoins((err,coins)=>{
      this.coins=coins;
    });
  }

  iniciar(){
    return (req,res,next)=>{
      req.variables={};
      req.variables.coins=this.coins;
      req.variables.criptografia= new Criptografia(conf);
      req.variables.database=this.db;
      req.variables.email=new Email(conf);
      next();
    }
  }
}

module.exports = { Inicializacion }