// const express = require('express');
// const mongoose = require('mongoose');
//const dotenv = require("dotenv");
// set up our express app
//const app = express();
// const cors = require("cors");


const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');
const progress = percent => console.log(`${percent*100}% processed`);

 const file = fs.readFileSync('sample/long-new-sample.mp4');
// const stream = fs.createReadStream('sample/mid-sample.mp4');

// stream.on('data',_buff=>{
//     gpmfExtract(_buff)
//     .then(extracted => {
//       goproTelemetry(extracted, {}, telemetry => {
//         fs.writeFileSync('output_path.json', JSON.stringify(telemetry));
//         console.log('Telemetry saved as JSON');
//       });
//     })
//     .catch(error => console.error(error));
// });
console.log("Extraction started!");
gpmfExtract(file,{progress})
.then(extracted => {
  console.log("Extraction Done!");

  goproTelemetry(extracted, {stream:['GPS5'], repeatSticky: true,smooth:3,progress}, telemetry => {
    

    var data=telemetry['1']['streams']['GPS5']["samples"];
    // console.log(data);
     fs.writeFileSync('output_path.json', JSON.stringify(data));
    console.log('Telemetry saved as JSON');
  });
})
.catch(error => console.error(error));

