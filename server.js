const express = require('express');
const cors = require('cors');
const routes = require("./routes/api/");

const { sequelize } = require("./models");

const app = express();

//enable cors
app.use(cors());
app.options('*',cors());

//parse json request body
app.use(express.json())

//parse unrlencoded json request body
app.use(express.urlencoded({extended:true}));

sequelize.sync({ force: false })
  .then(() => {
    console.log('Successfully connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.get("/",(req,res) => {
    res.json({message:"hello"});
});


app.use('/',routes);
const PORT = process.env.PORT || 3000;
//app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerDefinition));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

