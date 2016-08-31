const mongoose = require('mongoose');
require('mongoose-moment')(mongoose);

const EntrySchema = new mongoose.Schema({
  unix: {
    type: 'Moment',
    index: true,
  },
  name: String,
  title: String,
  url: String,
  ssid: String,
  ip: String,
});

const KeySchema = new mongoose.Schema({
  unix: {
    type: 'Moment',
    index: true,
  },
  keys: Array,
});

const NoteSchema = new mongoose.Schema({
  unix: {
    type: 'Moment',
    index: true,
  },
  title: String,
  body: String,
});

const DaySchema = new mongoose.Schema({
  unix: {
    type: Date,
    index: true,
    unique: true,
  },
  entries: [EntrySchema],
  keys: [KeySchema],
  notes: [NoteSchema],
});

module.exports = { Day: mongoose.model('Day', DaySchema) };
