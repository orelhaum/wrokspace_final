const { Criptografia } = require('../modules/criptografia');
const { Email } = require('../modules/email');

class Inicializacion{
  constructor(conf,db){
    this.db=db; //new Database(conf).getDb();
    this.conf=conf;
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