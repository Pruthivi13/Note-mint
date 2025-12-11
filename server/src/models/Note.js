const mongoose = require('mongoose');

console.log("!!! LOADING SOURCE MODELS/NOTE.JS WITH TAGS !!!"); 

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
    default: "",
  },
  content: {
    type: String,
    required: false,
    default: "",
  },
  summary: {
    type: String,
    required: false,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
