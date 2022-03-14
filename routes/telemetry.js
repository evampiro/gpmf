
const router = require("express").Router();

const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');
const progress = percent => console.log(`${percent*100}% processed`);


router.post("/",async(req,res,next)=>{

    try{
        console.log(req.body);
        const file = fs.readFileSync('sample/GOPR0001-small.mp4');
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
    }
    catch(e)
    {
        return res.status(500).json({"message":"Server Error: "+e});
    }
    
});

module.exports = router;
