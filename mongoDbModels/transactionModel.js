const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: [true, 'Please fill  _id'],
  },
  recordId: {
    type: String,
    required: [true, 'Please fill  recordId'],
  },
  tableName: {
    type: String,
    required: [true, 'Please fill  tableName'],
  },
  transactionType: {
    type: String,
    required: [true, 'Please fill  transactionType'],

  },
  dataBefore: {
    type: Object,
  },
  dataAfter: {
    type: Object,
  },
  changedProperties: {
    type: [String],
    required: [true, 'Please fill  changedProperties'],
  },
  changeSource: {
    type: String,
    required: [true, 'Please fill  changedProperties'],
  },
  creationTime: {
    type: Date,
    required: [true, 'Please fill  creationTime'],
  },
  isSync: {
    type: Boolean,
    default: false,
    required: [true, 'Please fill  isSync'],
  },
  syncTo: {
    type: [String],
    required: [true, 'Please fill  syncTo'],
  },
  entityId: {
    type: String,
  },
});

const transaction = mongoose.models.transaction || mongoose.model('transaction', transactionSchema);
module.exports = transaction;
