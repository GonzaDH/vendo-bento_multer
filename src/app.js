//Imports declarados por express-generator!
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cookie = require('cookie-parser');
const log = require("./middlewares/applicacion/log");
const session = require("express-session");
const middSession = require('./middlewares/applicacion/session');
const entreA = require("./middlewares/applicacion/entreA");
//--------
//Utilizamos Method-override para porder trabajar con metodos put y delete
let methodOverride = require('method-override')
//--------

//Requerimos Routers de todas los recursos que tenemos en el sitio
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
//--------

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'pagina de gonzas',
  resave: true,
  saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie())
app.use(express.static(path.join(__dirname, '../public')));
//Utilizamos method override para modificar los pedidos put y delete (utilizar siempre antes de las rutas)
app.use(methodOverride('_method'));

// Mis middlewares
app.use(log);
app.use(middSession)
app.use(entreA);

//Utilizamos los routers que importamos en la parte superior
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
