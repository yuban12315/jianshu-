let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let bodyParser = require('body-parser')
let connect=require('connect')
let MongoStore=require('connect-mongo')(session)
let config = require('./libs/db/config')

let index = require('./routes/index')
let users = require('./routes/users')
let articles=require('./routes/articles')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'fa.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser(config.secret))
app.use(session({
    secret: config.secret,
    cookie: config.cookieExpectTime,
    store:new MongoStore({
        url:config.url,
        useConnectionPooling: true
    })
}))
app.use(express.static(path.join(__dirname, 'public')))

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})
app.use('/', index)
app.use('/users', users)
app.use('/articles',articles)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
