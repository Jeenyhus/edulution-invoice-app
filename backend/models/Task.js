const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  shift: {
    type: String,
    required: true,
    enum: ['morning', 'afternoon']
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hoursWorked: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
