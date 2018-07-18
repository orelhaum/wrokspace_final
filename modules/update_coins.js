const { ServicioWeb } = require('./servicio_web_remoto'); 
const { Configuracion } = require('./configuracion');
const { CONSTANTES_CONF } = require('./constantes');
const { Database } = require('./database');


class UpdateCoins {
  constructor(c) {
    //creamos la instancia de la clase del archivo de configuración
    let conf = (c) ? c : new Configuracion('conf.json');
    //obtenemos el tiempo en el que se va a realizar las peticiones al servidor y pasamos a milisegundos
    this.periodicTime=conf.get(CONSTANTES_CONF.update_coins_periodic_time);
    this.max_time_historical= conf.get(CONSTANTES_CONF.update_coins_max_time_historical);
    this.sw = new ServicioWeb(conf);
    this.db = new Database(conf).getDb();
  }
  start() {
    console.log('iniciando update coins');
    this.now();
    setInterval(() => {
      //llamamos al método para obtener las monedas
      this.now();
    }, this.periodicTime*1000);
  }

  now() {  
    
    const max_samples=parseInt(this.max_time_historical/this.periodicTime); //4 cuando estamos haciendolo, puede cambiar
    //pide el nombre de todas las monedas al servidor y lo guarda en database
      
    this.sw.coins((err, coins) =>{
        this.db.setCoins(coins);
        //console.log(monedas);
        //Pide información al servidor de todas las monedas
        
        for (let coin of coins){
          this.sw.market(coin,(err,data)=>{
            this.db.setCoin(coin,data[0]);
            
            this.db.lenHistorical(coin,(err,longitud)=>{
              console.log(`longitud de la moneda ${coin}:${longitud}`);
              if (longitud>=max_samples){
                console.log('número maximo de muestras borrado ');
                this.db.lpopHistorical(coin,(err)=>{
                  //console.log(err)
                })
              }
            })
            this.db.rpushHistorical(coin,data[0],(err)=>{
              //console.log(err)
            });
          })
        }
      })
      ;
      
      //Pido los fondos al servidor y los guardo en Database
      this.sw.funds((err,funds)=>{
        //console.log(funds);
        this.db.setFunds(funds);
      })
      
/*
      //Pido el histórico del bitcoins y los guardo en database
      this.sw.historical('BTCUSDT',1,(err,data)=>{
        this.db.setHistorical(data);
      });
      */
  }
}

module.exports = { UpdateCoins };