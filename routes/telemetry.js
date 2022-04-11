
const router = require("express").Router();

const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');
const progress = percent => console.log(`${percent*100}% processed`);


router.post("/single",async(req,res,next)=>{

  if(req.body.isNotEmpty)
  {
    var element=req.body;
    try{
      const file = fs.readFileSync(element.path+element.name+'.'+element.mime);
    
      gpmfExtract(file,{progress}).then(extracted=>{
        goproTelemetry(extracted, { stream:['GPS5'],repeatSticky: true,smooth:3,progress}, ).then(telemetry => {
          
      
          var data=telemetry['1']['streams']['GPS5']["samples"];
    
          // console.log(data);
          fs.writeFileSync(element.path+element.name+'.json', JSON.stringify(data));
          console.log('Telemetry saved as JSON');
          console.log("here");
          return res.status(200);
        });
      });
      
  
  
    }
    catch(e)
    { 
      console.log(e);
      return res.status(400);
     
    }
  }
  else
  {
    return res.status(400);
  }
   
});
router.post("/",async(req,res,next)=>{

    try{

      await req.body.forEach(element => {
         
        

        const file = fs.readFileSync(element.path+element.name+'.'+element.mime);
        console.log("Extraction started!");
    gpmfExtract(file,{progress})
    .then(extracted => {
      console.log("Extraction Done!");
    
      goproTelemetry(extracted, {stream:['GPS5'], repeatSticky: true,smooth:3,progress}, telemetry => {
        
    
        var data=telemetry['1']['streams']['GPS5']["samples"];
        // console.log(data);
         fs.writeFileSync(element.path+element.name+'.json', JSON.stringify(data));
        console.log('Telemetry saved as JSON');
       
        return res.status(200);
      });
    })
    .catch(error => console.error(error));
    return res.status(400);
       });
       console.log("here");
      return res.status(200);

        
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
    
    }
    catch(e)
    {
        return res.status(500).json({"message":"Server Error: "+e});
    }
    
});

module.exports = router;
