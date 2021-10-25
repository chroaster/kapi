const mongoose = require('mongoose');

const CryptoTickerSchema = new mongoose.Schema(
  {
    _id: Number,
    utc: Date,
    krw: Number,
  },
  { collection: 'tickerLog' }
)

const model = mongoose.model('CryptoTicker', CryptoTickerSchema)

module.exports = model;