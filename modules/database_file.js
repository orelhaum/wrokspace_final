const fs = require('fs');
const { DatabaseBase } = require('./database_base');
const { CONSTANTES_CONF } = require('./constantes');


class DatabaseFile extends DatabaseBase {
  constructor(conf) {
    super(conf); //al crear un objeto de esta clase llama tambien al constructor de la clase que está después de extends
    this.directorio = conf.get(CONSTANTES_CONF.directorio_almacenamiento);
  }

  setCoins(coins, callback) {
    //console.log('Método setCoins implementado');
    const data = {
      //guardamos un objeto JSON y dentro guardamso ela tributo data con el array de monedas
      data: coins
    }
    // Asíncrono
    fs.writeFile(`${ this.directorio}coins.dat`, JSON.stringify(data, null, 2), function (err) {
      if (callback) callback(err);
      console.log('ya ha escrito el archivo');
    });
  }

  getCoins(callback) {
    //console.log('Método getCoins implementado');

    fs.readFile(`${ this.directorio}coins.dat`, function (err, data) {
      if ((err) && (callback)) {
        callback(err);
        return;
      } else {
        //los datos son correctos
        const dataJson = JSON.parse(data.toString());
        if (callback) callback(err, dataJson.data);
      }

    });
  }

  setCoin(coin, dataCoin, callback) {
    console.log('Método setCoin implementado');

    //console.log('Método setCoins implementado');
    const data = {
      //guardamos un objeto JSON y dentro guardamso ela tributo data con el array de monedas
      data: dataCoin
    }
    // Asíncrono
    fs.writeFile(`${this.directorio}${coin.toUpperCase()}.dat`, JSON.stringify(data, null, 2), function (err) {
      if (callback) callback(err);
      console.log('ya ha escrito el archivo');
    });
  }

  getCoin(coin, callback) {
    console.log('Método getCoin implementado');
    fs.readFile(`${this.directorio}${coin.toUpperCase()}.dat`, function (err, data) {
      if ((err) && (callback)) {
        callback(err);
        return;
      } else {
        //los datos son correctos
        const dataJson = JSON.parse(data.toString());
        if (callback) callback(err, dataJson.data);
      }
    });
  }

  setFunds(dataFunds, callback) {
    console.log('Método setFunds implementado');
    //console.log(dataFunds);
    const data = {
      //guardamos un objeto JSON y dentro guardamos el tributo data con el array de monedas
      data: dataFunds
    }
    //encriptamos para guardarlo bien
    const dataFundsCifrados = this.crypto.cifrar(JSON.stringify(data));
    // Asíncrono
    fs.writeFile(`${this.directorio}funds.dat`, dataFundsCifrados, (err) => {
      if (callback) callback(err);
      //console.log('ya ha escrito el archivo');
    });

  }

  getFunds(callback) {
    console.log('Método getFunds implementado');

    fs.readFile(`${this.directorio}funds.dat`, (err, data) => {
      if ((err) && (callback)) {
        callback(err);
        return;
      } else {
        //los datos son correctos
        const funds = this.crypto.descifrar(data.toString());
        const fundsJson = JSON.parse(funds);
        if (callback) callback(err, fundsJson.data);
      }
    });
  }

  setHistorical(dataHistorical, callback) {
    console.log('Método setHistorical implementado');

    const data = {
      //guardamos un objeto JSON y dentro guardamos el tributo data con el array de monedas
      data: dataHistorical
    }

    this.compresion.comprimir(JSON.stringify(data), (err, data) => {
      if (err) return console.log(err);
      // Asíncrono
      fs.writeFile(`${this.directorio}historical.tar.gz`, data, (err) => {
        if (callback) callback(err);
        //console.log('ya ha escrito el archivo');
      });
    })
  }

  getHistorical(callback) {
    console.log('Método getHistorical implementado');

    fs.readFile(`${this.directorio}historical.tar.gz`, (err, data) => {
      if ((err) && (callback)) return callback(err);
      else {
        //los datos son correctos
        this.compresion.desComprimir(data.toString(), () => {
          const historicalJson = JSON.parse(historical);
          if (callback) callback(err, historicalJson.data);
        });
      }
    });

  }
  close() {

  }
}

module.exports = { DatabaseFile }