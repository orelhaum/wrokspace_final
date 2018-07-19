const mongoose = require('mongoose');

const MongoClient = require('mongodb').MongoClient;

const { UserModel } = require('../models/user');
const { FundsModel } = require('../models/funds');
const { HistoricalModel } = require('../models/historical');
const { CoinsModel } = require('../models/coins');
const { CoinModel } = require('../models/coin');

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
    this.modelFunds=FundsModel.generateModel(mongoose);
    this.modelHistorical=HistoricalModel.generateModel(mongoose);
    this.modelUser=UserModel.generateModel(mongoose);
  }

  setCoins(coins, callback) {
    this.modelCoins.findOne((err,monedas)=>{
      if (err) return callback(err);
      if(!monedas) monedas =  new this.modelCoins({coins});
      else monedas.set({coins});

      monedas.save((err)=>{
        if (err) return callback(err);
      });
    })
  }

  getCoins( callback) {
    this.modelCoins.findOne(function (err, data) {
      if (err) return callback(err);
      if(data){
        callback(err,data.coins);
      }    
      else{
        callback(err,data);
      }  
    });
  }

  setCoin(coin,dataCoin, callback) {
    
    this.modelCoin.findOne({symbol:coin}, (err, data)=> {
      if (err) return callback(err); 
      if(!data) {
        data= new this.modelCoin(dataCoin);
        data.date=new Date();
      }
      else data.set(dataCoin);
      data.save((err)=>{
        if (err) return callback(err);
      });
    });
  }

  getCoin(coin, callback) {
    this.modelCoin.findOne({symbol:coin},callback);
    /* xq recibe un callback donde tiene dos argumetnos, error y los datos y ademas los datos se devuelven tal cual los devuelve mongo
    this.modelCoin.findOne({symbol:coin},function (err, dataCoin) {
      if (err) return callback(err);
      if (dataCoin) callback(err,dataCoin);
    });
    */
  }

  setFunds(funds, callback) {
    this.modelFunds.findOne((err,data)=>{
      if (err) return callback(err);
      if(!data) data =  new this.modelFunds(funds);
      else data.set(funds);
      data.date=new Date();
      data.save((err)=>{
        if (err) return callback(err);
      });
    })
  }

  getFunds( callback) {
    this.modelFunds.findOne((err,data)=>{
      if (err) return callback(err);
      callback(err,data);
    });
  }

  lenHistorical(coin, callback) {
    //console.log('Método lenHistorical implementado');
    this.modelHistorical.countDocuments({symbol:coin}, (err, longitud) => {
      //console.log(longitud);
      callback(err,longitud);
    })
  }

  lpopHistorical(coin, callback) {
    //console.log('Método lpopHistorical implementado');
    this.modelHistorical.findOne({symbol : coin}).sort('date').exec((err,data)=>{
      if (err) return callback(err);
      if(data) data.remove((err)=>{
        callback(err);
      });
    });
  }
  rpushHistorical(coin,coinData, callback) {
    //console.log('Método rpushHistorical implementado');
    if(coinData){
      coinData.date=new Date();
    }
    let data = new this.modelHistorical(coinData);
    data.save((err)=>{
      callback(err);
    });
  }
  

  createUser(user, callback) {
    console.log('Método createUser implementado');
    this.modelUser.findOne({usuario: user.usuario}, (err, data)=> {
      if (err) return callback(err); 
      if(!data) {
        console.log('No encontrado el usuario');
        data= new this.modelUser(user);
        data.date=new Date();
      }
      else data.set(user);
      console.log(data);
      data.save((err)=>{
        if (err) return callback(err);
        return callback();
      });
    });
  }
}

module.exports = { DatabaseMongo }