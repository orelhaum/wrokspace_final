const MongoClient = require('mongodb').MongoClient;
const f = require('util').format;
 
const { CONSTANTES_CONF } = require('./modules/constantes');
const { Configuracion } = require('./modules/configuracion');

let conf = new Configuracion('conf.json');

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

// Connection URL
//const url = 'mongodb://prueba:cursomeancore2@ds019254.mlab.com:19254/prueba?authMechanism=DEFAULT';
//const url = 'mongodb://prueba:Prueba5633@ds023452.mlab.com:23452/prueba_ramiro?authMechanism=DEFAULT';
 
// Use connect method to connect to the Server
MongoClient.connect(urlConnection, (err, client)=> {
 
  console.log("Connected correctly to server");
  const db = client.db(this.database_mongo_dbname);
 
  // Insert a single document

  db.collection(this.database_mongo_name).insertOne({a:34}, function(err, r) {
    if (err) return console.log(err);
    console.log('Insertado')
    client.close();
  });
 
   
});