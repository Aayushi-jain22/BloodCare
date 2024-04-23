require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const jwt_decode = require("jwt-decode");



const brouter = require("./routes/blood");
const prouter = require("./routes/patient");
const drouter = require("./routes/donor");


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

app.use('/', brouter);
app.use('/patient', prouter);
app.use('/donor', drouter);



app.listen(process.env.PORT|3001, function(){
  console.log("Server started on port 3001.");
});
