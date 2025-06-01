const mongoose = require('mongoose');

const anagramSchema = new mongoose.Schema({
  word: String,
  scrambled: String,
  solution: String,
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }
});

module.exports = mongoose.model('Anagram', anagramSchema);
