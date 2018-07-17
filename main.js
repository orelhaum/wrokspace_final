//Importaciones de módulos de terceros
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();

//Importaciones de mis módulos
const { Respuestas } = require('./modules/respuestas');
const { Database } = require('./modules/database');
const { Configuracion } = require('./modules/configuracion');

//Importaciones de mis Middlewares
const { Validacion } = require('./middlewares/validacion');
const { Inicializacion } = require('./middlewares/inicializacion');


//Importaciones de mis modelos
const { UserModel } = require('./models/usuarios');

//Inicializo la Base de datos
const conf = new Configuracion('conf.json');
const db = new Database(conf).getDb();

//inicialización de variables que van a durar todo el ciclo de vida de la petición
const ini= new Inicializacion(conf);

//Variables globales de Express
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Middlewares de terceros
app.use('/',express.static(path.join(__dirname,'public')));
app.use(bodyParser.raw()); // no parsea realmente, sino que convierte los datos recibidos del body a una variable de tipo Buffer que puede ser manejada por los siguientes middlewares
app.use(bodyParser.json()); // para parsear application/json
app.use(bodyParser.urlencoded({ extended: true })); // para parsear application/x-www-form-urlencoded
app.use(passport.initialize());
app.use(passport.session());

//Middlewares míos
app.use(ini.iniciar());
//app.use(seguridad.comprobar);
//////app.use(Validacion.validar);


let fields =  {
  usernameField: 'username',
  passwordField: 'password'
}

let loginFunction = (username, password, done) => {
  if ((username === 'usuario') && (password === 'password')) {
    return done(null, {username, loginDate: new Date()});
  }
  return done(null, false, { message: 'Incorrect username.' });
}

passport.use(new LocalStrategy(fields, loginFunction));

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



//Rutas
//Métodos de la página web
app.get('/pruebaIndex', (req, res,next)=> {
  console.log('dentro de pruebaindex');
    //mando a la pagina
    res.render('index',{title:"Prueba de Pug"});
});


app.get('/prueba', (req, res,next)=> {
  db.getCoins((err,coins)=>{
    if(err) return res.send(`Se ha producido un error: ${err}`)
    //tengo las monedas
    //pregunto precio
    //mando a la pagina
    res.render('index',{title:"Prueba de Pug"});
  });
});

//Métodos del servicio web
//market
app.get('/coins', (req, res) =>{
  db.getCoins((err,coins)=>{
    if(err) return res.json(Respuestas.error(err))
    res.json(Respuestas.ok(coins))
  });
});

//market/<coin_name>
app.get('/market/:coinName',Validacion.validar, (req, res)=> {
    db.getCoin(req.params.coinName,(err,coin)=>{
    if(err) return res.json(Respuestas.error(err))
    res.json(Respuestas.ok([coin]))
  });
});

//historical/<coin_name>/<hours>
app.get('/historical/:coinName/:hours', Validacion.validar,(req, res)=> {
  db.getHistorical(req.params.coinName,(err,historical)=>{
    if(err) return res.json(Respuestas.error(err))
    res.json(Respuestas.ok(historical))
  });
});

///info_users
app.get('/info_users', (req, res)=> {
  res.send('info_users');
});

//funds
app.post('/funds', (req, res)=> {
  //res.send('funds');
  db.getFunds((err,coin)=>{
    if(err) return res.json(Respuestas.error(err))
    res.json(Respuestas.ok([coin]))
  });
});

///buy/<coin_name>/<percent>
app.post('/buy/:coinName/:percent', (req, res) =>{
  res.send(`Comprando ${req.params.coinName} un porcentaje de ${req.params.percent}`);
});

///sell/<coin_name>/<percent>
app.post('/sell/:coinName/:percent', (req, res) =>{
  console.log(req.body);
  res.send(`Vendiendo ${req.params.coinName} un porcentaje de ${req.params.percent}`);
});

//msg/list
app.post('/msg/list', (req, res) =>{
  res.send(`Listando los mensajes`);
});

//msg/send
app.post('/msg/send', (req, res) =>{
  res.send(`Enviando mensaje`);
});

//msg/read/<id>
app.post('/msg/read/:id', (req, res) =>{
  res.send(`Leyendo el mensaje ${req.params.id}`);
});

//msg/remove/<id>
app.post('/msg/remove/:id', (req, res) =>{
  res.send(`Borrando el mensaje ${req.params.id}`);
});

//msg/remove_all
app.post('/msg/remove_all/', (req, res) =>{
  res.send(`Borrando todos los mensajes`);
});


///user/register
app.post('/user/register', (req, res,next) =>{
  UserModel.createUser(req ,(err)=>{
    if(err) return next(err);
    res.json(Respuestas.ok());
  });
});

///user/validate
app.get('/user/validate/:usuario/:tokenRegistro', (req, res,next)=> {
  UserModel.validateUser(req,(err)=> {
    if(err) return next(err);
    // {
    //  res.json(Respuestas.error(err));
    //}
   // else
    //{
      res.json(Respuestas.ok("Registro validado correctamente"));
    //}
  })
});

///user/login
app.get('/user/login', (req, res) => {
  if (req.session) console.log(req.session.user);	// { username: 'usuario', loginDate: ... }
  res.end('login');
});

app.post('/user/login', passport.authenticate(('local'), { failureRedirect: '/user/login' }), (req, res) => {
  res.redirect('/');
});
/*
app.post('/user/login', (req, res)=> {
  UserModel.loginUser(req,(err)=> {
    if(err) {
      res.json(Respuestas.error(err));
    }
    else
    {
      res.json(Respuestas.ok("Login realizado correctamente"));
    }
  })
});
*/
// Esta ruta siempre debe ubicarse en el último lugar
app.use(function (req, res, next) {
  res.status(404).json({
    "ok":false,
    "msg":"Página no encontrada",
    "code":404,
    "data":[]
  })
})

app.use(function (err,req, res, next) {
  console.log('se ha producido un error:' + err);
  //si falla alguno internamente devovlemos el error 500
  res.status(500).end(err);
})

app.listen(8085);