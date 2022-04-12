require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const cookieparser = require('cookie-parser');
const routes = require("./routes/api/");
const { sequelize } = require("./models");
const passportConfig = require('./passport/localStrategy');
const cookieParser = require('cookie-parser');
const mySqlStore = require('express-mysql-session')(session);

const app = express();

app.set('port', process.env.PORT || 3000);

//enable cors
app.use(cors());
app.options('*',cors());

//parse json request body
app.use(express.json())

//parse unrlencoded json request body
app.use(express.urlencoded({extended:true}));

//cookie activate
app.use(cookieParser(process.env.COOKIE_SECRET));

//mysql session activate
const mySqlOption = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

const sessionStore = new mySqlStore(mySqlOption);


app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:process.env.COOKIE_SECRET,
  cookie:{
    httpOnly:true,
    secure:false,
  },
  store: sessionStore
}));

//DB sync
sequelize.sync({ force: false })
  .then(() => {
    console.log('Successfully connected');
  })
  .catch((err) => {
    console.error(err);
});

//passport init
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.get("/",(req,res) => {
    res.json({message:"hello"});
});

app.use('/',routes);


module.exports = app;
//app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerDefinition));



