const mongoose = require('mongoose');


const sessionSchema = new mongoose.Schema({
    _id : String,
    session : String,
    expires : Date

});

module.exports = mongoose.model('session', sessionSchema);
