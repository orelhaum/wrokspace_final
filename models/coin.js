//const { Configuracion } = require('../modules/configuracion');
//let conf = new Configuracion('conf.json');

/*
const camposCoin={
  highPrice : "highPrice",
  prevClosePrice : "prevClosePrice",
  bidPrice : "bidPrice",
  openPrice : "openPrice",
  askPrice : "askPrice",
  priceChangePercent : "priceChangePercent",
  lastPrice :"lastPrice",
  weightedAvgPrice :"weightedAvgPrice",
  quoteVolume : "quoteVolume",
  priceChange : "priceChange",
  closeTime : "closeTime",
  volume : "volume",
  bidQty : "bidQty",
  symbol : "symbol",
  date:"date"
}
*/

class CoinModel{
  constructor(c){
    //let conf = (c) ? c: new Configuracion('conf.json');
  }

  static generateModel(mongoose){

    let Schema = mongoose.Schema;
    
    let schema = new Schema({
      lowPrice:{
        type: Number
      },
      highPrice:{
        type: Number
      },
      prevClosePrice:{
        type: Number
      },
           bidPrice:{
      type: Number
          },
      openPrice:{
        type: Number
      },
      askPrice:{
        type: Number
      },
      priceChangePercent:{
        type: Number
      },
      lastPrice:{
        type: Number
      },
      weightedAvgPrice:{
        type: Number
      },
      quoteVolume:{
        type: Number
      },
      priceChange:{
        type: Number
      },
      closeTime:{
        type: Date
      },
      volume:{
        type: Number
      },
      bidQty:{
        type: Number
      },
      symbol:{
        type: String,
        upppercase:true
      },
      fecha:{
        type: Date
      }
    },{collection:'coin',versionKey: false });

    return mongoose.model('Coin',schema);
  }
}

module.exports = { CoinModel }