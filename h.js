const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    const date = new Date();
    const year = date.getDate();
    res.status(200).send(`${year}`)
})

app.listen(3000,()=>{
    console.log('Server started');
})