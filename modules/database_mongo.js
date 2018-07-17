const MongoClient = require('mongodb').MongoClient;

const mongoose = require('mongoose');
const { UserModel } = require('../models/user');
const { DatabaseBase } = require('./database_base');
const { CONSTANTES_CONF } = require('./constantes');


class DatabaseMongo extends DatabaseBase {
  constructor(conf) {
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends
    const database_mongo_host= conf.get(CONSTANTES_CONF.database_mongo_host);
    const database_mongo_port= conf.get(CONSTANTES_CONF.database_mongo_port);

    const database_mongo_name= conf.get(CONSTANTES_CONF.database_mongo_name);
    const database_mongo_dbname= conf.get(CONSTANTES_CONF.database_mongo_dbname);
    //const database_mongo_authentication= conf.get(CONSTANTES_CONF.database_mongo_authentication);

    let urlConnection = `mongodb://${database_mongo_host}:${database_mongo_port}/${database_mongo_name}?authMechanism=DEFAULT`;

    if(conf.get(CONSTANTES_CONF.database_mongo_authentication)){
      const database_mongo_user= conf.get(CONSTANTES_CONF.database_mongo_user);
      const database_mongo_password= conf.get(CONSTANTES_CONF.database_mongo_password);
      urlConnection = `mongodb://${database_mongo_user}:${database_mongo_password}@${database_mongo_host}:${database_mongo_port}/${database_mongo_name}?authMechanism=DEFAULT`;
    }

    mongoose.connect(urlConnection,{ useNewUrlParser: true},function(err, client) {
      this.client=client;
    })
    this.db = mongoose.connection;
    //genera todos los modelos
    UserModel.generateModel();
  }

  setCoins(coins, callback) {
    const data={
      coins
    }
    this.db = this.client.db(database_mongo_dbname);
    this.col = this.db.collection('coins');
    this.col.insertOne(data, function(err, r) {
      if (err) return console.log(err);
      console.log('Insertado')
      client.close();
    });

    if (callback) callback();
  }

  close(callback) {
    if (this.client.connected) this.client.quit();
    if(callback) callback();
  }
}

module.exports = { DatabaseMongo }