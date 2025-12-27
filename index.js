//import express
const express=require("express");

//import route
const route=require("./route")

//import cors
const cors=require("cors")

//creaet server using express method
const collabaiServer=express();

//use the variable
collabaiServer.use(cors());
collabaiServer.use(express.json());//parse the middleware
collabaiServer.use(route)


//create PORT
PORT=4000 || process.env.PORT;

//listen the server
collabaiServer.listen(4000,()=>{
    console.log(`server running in ${PORT}`)
})

//GET THE SERVER
collabaiServer.get('/',(req,res)=>{
    res.status(200).send("<h1>Collabaai server started</h1>")
})