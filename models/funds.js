const { Configuracion } = require('../modules/configuracion');
//let conf = new Configuracion('conf.json');


const camposFunds={
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

class FundsModel{
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
      fee:{
        type: Number
      },
      btc:{
        type: Number
      },
      transactions:{
        type: [{
          coin_name:{
            type: String
          },
          quantity:{
            type: Number
          },
          date:{
            type: Date
          },
          action:{
            type: String
          },
        }]
      },
      funds:{
        type: Map,
        of: String
      },
      dolars:{
        type: Number
      },
      date:{
        type: Date
      }
    },{collection:'funds',versionKey: false });

    return mongoose.model('Funds',schema);
  }
}

module.exports = { FundsModel }