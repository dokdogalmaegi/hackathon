const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    id : String,
    pw : String,
    name : String,
});

module.exports = mongoose.model('user', userSchema);
