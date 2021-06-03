const mongoose = require("mongoose");

exports.connect = async () => {
    
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        console.log("> Conectado a MongoDB");
    
};
