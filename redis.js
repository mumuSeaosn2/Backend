const redis=require('redis')
require('dotenv').config()

const client=redis.createClient({url: 'redis://mumuseason2-redis:6379'});
client.connect();

client.on("error",(err)=>{
  console.error(err);
});

client.on("ready",()=>{
  console.log("Redis is ready");
});

module.exports =client