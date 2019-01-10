const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const users = require('./routes/users');
//Mongodb config
const db = require('./config/keys').mongoURI;

//Database connection
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log("connected to mongodb"))
  .catch(err => console.log(err));

//use middleware  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//use routes
app.use('/api', users);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server running on ${port}`));