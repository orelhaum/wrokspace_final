//const { Configuracion } = require('../modules/configuracion');

class CoinsModel{
  constructor(c){
    //let conf = (c) ? c: new Configuracion('conf.json');
  }
  static generateModel(mongoose){

    let Schema = mongoose.Schema;

    let schema = new Schema({
      coins : {
        type: [String]
      }
    },{collection:'coins',versionKey: false });

    return mongoose.model('Coins',schema);
  }
}

module.exports = { CoinsModel }