const mongoose = require('mongoose');

const MongoClient = require('mongodb').MongoClient;

const { UserModel } = require('../models/user');
const { CoinsModel,CoinModel,camposCoin } = require('../models/coin');
const { DatabaseBase } = require('./database_base');
const { CONSTANTES_CONF } = require('./constantes');


class DatabaseMongo extends DatabaseBase {
  constructor(conf) {
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends
    const database_mongo_host= conf.get(CONSTANTES_CONF.database_mongo_host);
    const database_mongo_port= conf.get(CONSTANTES_CONF.database_mongo_port);

    this.database_mongo_name= conf.get(CONSTANTES_CONF.database_mongo_name);
    this.database_mongo_dbname= conf.get(CONSTANTES_CONF.database_mongo_dbname);
    //const database_mongo_authentication= conf.get(CONSTANTES_CONF.database_mongo_authentication);

    let urlConnection = `mongodb://${database_mongo_host}:${database_mongo_port}/${this.database_mongo_name}?authMechanism=DEFAULT`;

    if(conf.get(CONSTANTES_CONF.database_mongo_authentication)){
      const database_mongo_user= conf.get(CONSTANTES_CONF.database_mongo_user);
      const database_mongo_password= conf.get(CONSTANTES_CONF.database_mongo_password);
      urlConnection = `mongodb://${database_mongo_user}:${database_mongo_password}@${database_mongo_host}:${database_mongo_port}/${this.database_mongo_dbname}?authMechanism=DEFAULT`;
    }


    mongoose.connect(urlConnection, { useNewUrlParser: true });
    this.client= mongoose.connection;

    this.modelCoins=CoinsModel.generateModel(mongoose);
    this.modelCoin=CoinModel.generateModel(mongoose);
  }

  setCoins(coins, callback) {
    let monedas =  new this.modelCoins({coins});
    monedas.save(function (err,monedas){
      if (err) return console.error(err);

      if (callback) callback();
    });
  }

  getCoins( callback) {
    this.modelCoins.find(function (err, coins) {
      if (err) return console.error(err);

      if (callback) callback(err,coins);
    });
  }

  setCoin(coin,dataCoin, callback) {
    let datos={};

      datos[camposCoin.highPrice]= dataCoin[camposCoin.highPrice]; 
      datos[camposCoin.prevClosePrice]=dataCoin[camposCoin.prevClosePrice];
      datos[camposCoin.bidPrice]=dataCoin[camposCoin.bidPrice];
      datos[camposCoin.openPrice]=dataCoin[camposCoin.openPrice]; 
      datos[camposCoin.askPrice]=dataCoin[camposCoin.askPrice];
      datos[camposCoin.priceChangePercent ]=dataCoin[camposCoin.priceChangePercent];
      datos[camposCoin.lastPrice]=dataCoin[camposCoin.lastPrice]; 
      datos[camposCoin.weightedAvgPrice]=dataCoin[camposCoin.weightedAvgPrice]; 
      datos[camposCoin.quoteVolume]=dataCoin[camposCoin.quoteVolume]; 
      datos[camposCoin.priceChange]=dataCoin[camposCoin.priceChange]; 
      datos[camposCoin.closeTime]=dataCoin[camposCoin.closeTime]; 
      datos[camposCoin.volume]=dataCoin[camposCoin.volume]; 
      datos[camposCoin.bidQty]=dataCoin[camposCoin.bidQty];
      datos[camposCoin.symbol]=dataCoin[camposCoin.symbol]
    
    let moneda =  new this.modelCoin(datos);
    
    moneda.save(function (err,monedas){
      if (err) return console.error(err);

      if (callback) callback();
    });
  }

  getCoin(coin, callback) {
    this.modelCoin.find({symbol:coin},function (err, dataCoin) {
      if (err) return console.error(err);

      if (callback) callback(err,dataCoin);
    });
  }
}

module.exports = { DatabaseMongo }