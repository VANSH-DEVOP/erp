const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const dbConnect = async () =>{
    mongoose.connect(process.env.MONGO_URL).then(() => console.log("Server is connected to DB"))
    .catch((err) => {console.log("conecction of server and DB failed");
                    console.error(err);
                process.exit(1);})
}

module.exports = dbConnect;