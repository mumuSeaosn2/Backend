require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieparser = require('cookie-parser');
const apiroutes = require("./controller/api/");
const authroutes = require("./controller/auth/");
const docs = require("./controller/api/docs.controller");
const { sequelize } = require("./models");
const passportConfig = require('./passport/passportConfig')
const cookieParser = require('cookie-parser');
const auth = require('./service/auth.service');
const redis=require('redis')
const app = express();

const client=redis.createClient({url: 'redis://mumuseason2-redis:6379'});
client.connect();
client.set(1,2);
client.get(1);


//enable cors
/*
const  corsOptions = {
  origin:"http://localhost:8080/",
  credential: true,
};
app.use(cors(corsOptions));*/
app.use( cors({ 
  origin: [  
    "http://localhost:8080","http://localhost:8081" ], 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
     preflightContinue: false, 
     optionsSuccessStatus: 204, 
     credentials: true, }) );


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

//DB sync
sequelize.sync({ force: false })
  .then(() => {
    console.log('Successfully connected');
  })
  .catch((err) => {
    console.error(err);
});

//passport setting
passportConfig();

app.get("/",(req,res) => {
    //res.json({message:"hello"});
    res.sendFile(__dirname + '/login_test.html');
});

app.get("/test",(req,res) => {
  //res.json({message:"hello"});
  res.sendFile(__dirname + '/test.html');
});
//const chatRouter = require('./routes/api/chat');

app.use('/auth',authroutes);

app.use('/',apiroutes);



//app.use('chat',chatRouter);

app.use('/docs',docs);


app.set('port', process.env.PORT || 3000);

module.exports = app;
//app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerDefinition));



