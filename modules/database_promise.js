const { Database, DatabaseBase } = require("./database");

class DatabasePromise extends Database {

  constructor(conf) {
    super(conf)

    const db = this.getDb();
    const handler = {

      // target --> método que se invoca
      // propKey --> objeto que contiene el método
      // receiver --> parámetros de la función
      apply(target, propKey, receiver) {

        return new Promise((resolve, reject) => {

          receiver.push((err, data) => {
            if (err) reject(err);
            resolve(data)
          })
          target.call(propKey, ...receiver);
        }) 
      }
    };

    let methods = Object.getOwnPropertyNames(db.__proto__);
    for (let method of methods) {
      db[method] =  new Proxy(db[method], handler)
    }
  }
}

module.exports = { DatabasePromise }