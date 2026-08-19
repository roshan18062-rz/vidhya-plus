const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institute',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

CounterSchema.index({ instituteId: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Counter', CounterSchema);
