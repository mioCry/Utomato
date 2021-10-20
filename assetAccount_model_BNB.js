//
// assetAccount_model
// 
// @2021 utomato_crypto
// v BNB_

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assetSchema = new Schema({
  timestamp: Number,           // date
  asset: String,               // asset
  assetValue:  String,         // assetQty
  
});

module.exports = mongoose.model('assetAccount', assetSchema);
