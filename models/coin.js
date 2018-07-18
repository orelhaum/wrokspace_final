const { Configuracion } = require('../modules/configuracion');
//let conf = new Configuracion('conf.json');


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
  symbol : "symbol"
}

class CoinsModel{
  constructor(c){
    let conf = (c) ? c: new Configuracion('conf.json');
  }
  static generateModel(mongoose){

    let Schema = mongoose.Schema;

    let schema = new Schema({
      coins : {
        type: []
      }
    },{collection:'coins',versionKey: false });

    return mongoose.model('Coins',schema);
  }
}

class CoinModel{
  constructor(c){
    let conf = (c) ? c: new Configuracion('conf.json');
  }

  static generateModel(mongoose){

    let Schema = mongoose.Schema;

    /*"lowPrice": 6667.72,
            "highPrice": 7550,
            "prevClosePrice": 6696.13,
            "bidPrice": 7422.43,
            "openPrice": 6696.14,
            "askPrice": 7424.38,
            "priceChangePercent": 10.847,
            "lastPrice": 7422.44,
            "weightedAvgPrice": 7173.04248003,
            "quoteVolume": 416070210.84032357,
            "priceChange": 726.3,
            "closeTime": 1531898626452,
            "volume": 58004.704698,
            "bidQty": 3,
            "symbol": "BTCUSDT"
            */
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
            }
    },{collection:'coin',versionKey: false });

    return mongoose.model('Coin',schema);
  }
}

module.exports = { CoinsModel, CoinModel,camposCoin }