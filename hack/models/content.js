
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let writingSchema = new Schema({
    author : String,
    title : String,
    file : String,
})

module.exports = mongoose.model('write', writingSchema);