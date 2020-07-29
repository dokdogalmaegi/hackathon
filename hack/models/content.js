
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let writingSchema = new Schema({
    author : String,
    title : String,
    content : String,
    file : String,
    extension : String,
})

module.exports = mongoose.model('write', writingSchema);