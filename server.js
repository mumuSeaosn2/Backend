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

const app = express();

//enable cors
app.use(cors());
app.options('*',cors());

//parse json request body
app.use(express.json())

//parse unrlencoded json request body
app.use(express.urlencoded({extended:true}));

//cookie activate
app.use(cookieParser(process.env.COOKIE_SECRET));

//memory session activate
app.use(session({
  resave:false,
  saveUninitialized:false,
  secret:process.env.COOKIE_SECRET,
  cookie:{
    httpOnly:true,
    secure:false,
  }
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
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("/",(req,res) => {
    res.json({message:"hello"});
});


app.use('/',routes);
const PORT = process.env.PORT || 3000;
//app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerDefinition));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

