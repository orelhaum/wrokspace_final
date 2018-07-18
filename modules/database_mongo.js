const mongoose = require('mongoose');

const MongoClient = require('mongodb').MongoClient;

const { UserModel } = require('../models/user');
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


/*
    mongoose.connect(urlConnection,{ useNewUrlParser: true},function(err, client) {
      this.client=client;
    })
    this.db = mongoose.connection;
    //genera todos los modelos
    UserModel.generateModel();
*/
    this.client=undefined;

    MongoClient.connect(urlConnection, (err, client)=> {
    
      console.log("Connected correctly to server");
      this.client=client;
      /*
      const db = client.db(this.database_mongo_dbname);
    
      // Insert a single document

      db.collection(this.database_mongo_name).insertOne({a:'desde database'}, function(err, r) {
        if (err) return console.log(err);
        console.log('Insertado')
        client.close();
      });
     */
       
    });

  }

  setCoins(coins, callback) {
    const data={
      coins
    }
    console.log(this.client);
    const db = this.client.db(this.database_mongo_dbname);
    db.collection(this.database_mongo_name).insertOne({coins}, function(err, r) {
      if (err) return console.log(err);
      console.log('Insertado')
      //client.close();
    });
    /*
    this.col.insertOne(data, function(err, r) {
      if (err) return console.log(err);
      console.log('Insertado')
      client.close();
    });
*/
    if (callback) callback();
  }

  close(callback) {
    if (this.client.connected) this.client.quit();
    if(callback) callback();
  }
}

module.exports = { DatabaseMongo }