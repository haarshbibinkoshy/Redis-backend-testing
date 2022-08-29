const express = require('express');
const app=express();
const axios = require('axios');
const Redis = require('Redis');

const cors = require('cors');

const redisClient = Redis.createClient()

const Default_expiration =10
app.use(express.urlencoded({extended:true}));
app.use(cors());

//if exists in redis then send redis value 
//else get from db and store in redis and send to frontend


app.get("/photo1", async (req, res) => {
    // console.log(req);
    
        await redisClient.connect()
       let result= await redisClient.get(`photos`)
       console.log(result,`<<<result`);
                if (result) {
                    // console.log();
                    res.json(JSON.parse(result));
                   
                }else{
                    
                    const {data} = await axios.get("https://jsonplaceholder.typicode.com/users",{
                        // params:{albumId}
                    })
                    redisClient.setEx("photos",Default_expiration, JSON.stringify(data))
                   
                    res.json(data);
                }
                redisClient.quit()


    // console.log(await redisClient.exists(`photos/${albumId}`));
})

app.listen(3000,()=>{ 
    console.log(`server running!!`);
})