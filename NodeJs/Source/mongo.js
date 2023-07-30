const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/LoginInfo")

.then(() => {
    console.log("mongodb connected");
})
.catch(() => {
    console.log("mongo failed to Connect");
});


const userSchema = new mongoose.Schema({
    name:String,
    username:String,
    password:String
});

module.exports = new mongoose.model('userData',userSchema);