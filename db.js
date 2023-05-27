const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/Notebook"
const connect = () => {
    mongoose.connect(uri)
        .then(() => console.log("Database connected"))
        .catch((err) => console.log(err));
}
module.exports = connect;