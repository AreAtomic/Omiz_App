const mongoose = require('mongoose');
const LiveSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model('Live', LiveSchema);
