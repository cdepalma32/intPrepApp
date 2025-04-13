// anagram model stores the original words and their grouped anagram counterparts

const mongoose = require('mongoose');

const anagramSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
    },
    groupedAnagrams: {
        type: [String], // array of words that are anagrams
        required: true,
    },
}, { timestamps:true });

const Anagram = mongoose.model('Anagram', anagramSchema);

module.exports = Anagram;