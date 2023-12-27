const mongoose = require("mongoose");
const connectDb = async() => {
    try { 
        const connect = await mongoose.connect(
          process.env.MONGO_CLIENT_CONNECTION
        );
        const infoConnect = {
            host: connect.connection.host,
            name:connect.connection.name
        }
        console.log("Database connected",infoConnect)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
module.exports=connectDb