const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true
}).then( result => {
         console.log('connect to db')
       })
       .catch( err => {
        console.log(err);
       }); 


