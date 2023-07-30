const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/LoginInfo')
.then(() => {
    console.log("mongodb1 connected");
})
.catch(() => {
    console.log("mongodb1 failed to Connect");
});


const schema = new mongoose.Schema({
    name:String,
    username:String,
    question:String,
    answer:String
});

module.exports = new mongoose.model("que-ans",schema);