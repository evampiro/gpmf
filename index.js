 
// const mongoose = require('mongoose');
//const dotenv = require("dotenv");
// set up our express app


const cors = require("cors");
const express = require('express');


const app = express();

var http = require('http');
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.static('public'));

const telemetryRoute = require("./routes/telemetry");

app.use("/api/telemetry", telemetryRoute); 


var httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 4000, "0.0.0.0", function() {
  console.log('Ready to Go!');

});
 

