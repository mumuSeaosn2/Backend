const redis=require('redis')
require('dotenv').config()

const client=redis.createClient({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT
});

client.on("error",(err)=>{
  console.error(err);
});

client.on("ready",()=>{
  console.log("Redis is ready");
});

module.exports =client