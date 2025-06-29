const Anagram = require('../models/Anagram');
const User = require('../models/User');

const getAnagrams = async (req, res) => {
  try {
    const anagrams = await Anagram.find().populate('topic', 'name');
    res.status(200).json(anagrams);
  } catch (err) {
    console.error('Error fetching anagrams:', err);
    res.status(500).json({ error: 'Failed to fetch anagrams' });
  }
};


function scrambleWithWordLengths(phrase) {
  const words = phrase.trim().split(' ');
  const lengths = words.map(word => word.length); // e.g., [5, 10]
  const allLetters = phrase.replace(/\s/g, '').split(''); // all letters without spaces

  // shuffle the letters
  const shuffled = allLetters.sort(() => Math.random() - 0.5);

  // slice by original word lengths
  const scrambledWords = [];
  let i = 0;
  for (const len of lengths) {
    scrambledWords.push(shuffled.slice(i, i + len).join(''));
    i += len;
  }

  return scrambledWords.join(' ');
}

const submitAnagram = async (req, res) => {
    try {
        const { userId, anagramId, answer } = req.body; // extract necessary data from the request body
        
        // logic to validate the submitted answer
        // for example, fetch the anagram from the database and compare the answer
        const anagram = await Anagram.findById(anagramId); // assuming you have an 'Anagram' model
        if (!anagram) {
            return res.status(404).json({ error: 'Anagram not found.'});
        }
        const isCorrect = anagram.correctAnswer === answer.toLowerCase();

        if (isCorrect) {
            // assuming you have a user model and method to track progress
            await User.updateOne(
                { _id: userId },
                { $inc: { score:10 } } // Example: increment user score
            );
        }
        res.status(201).json({
            message: isCorrect ? 'Correct answer!' : 'Incorrect answer!',
            isCorrect,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit anagram answer.'});
    }
};

const createAnagram = async (req, res) => {
    try {
        const { word, solution, topic } = req.body; // extract anagram details from the request body
        // logic to create an anagram
        if (!word || !solution || !topic ) {
            return res.status(400).json({ error: 'All fields are required.'});
        }
        const scrambled = scrambleWithWordLengths(word);
    // save to db
    const newAnagram = await Anagram.create({ word, scrambled, solution, topic });
    res.status(201).json(newAnagram);
  } catch (error) {
    console.error('Error creating anagram:', error);
    res.status(500).json({ error: 'Failed to create anagram.' });
  }
};
    

const updateAnagram = async (req, res) => {
    try{
        const { id } = req.params; // extract anagram ID from URL
        const { word, scrambled, solution } = req.body;
        // find and update anagram
        const updatedAnagram = await Anagram.findByIdAndUpdate(
            id, 
            { word, scrambled, solution }, 
            { new: true, runValidators: true} // return updated doc
        );
        if (!updatedAnagram) {
            return res.status(404).json({error: 'Anagram not found!'});
        }
        // logic to update an existing anagram
        res.status(200).json(updatedAnagram);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update anagram.'});
    }
    };

const deleteAnagram = async (req, res) => {
    try {
        const { id} = req.params; // extract anagrm ID from URL
        const anagram = await Anagram.findById(id); // check if anagram exists
        if (!anagram) {
            return res.status(404).json({error: 'Anagram not found!'});
        }
        // logic to delete an anagram
        await Anagram.findByIdAndDelete(id);
        res.status(200).json({ message: `Anagram ${id} deleted successfully!`});
        } catch (error) {
            console.error('Error deleting anagram:', error); // logs the error
            res.status(500).json({ error: 'Failed to delete anagram.'});
        }
    };

// export all functions
module.exports = {
    getAnagrams,
    submitAnagram, 
    createAnagram,
    updateAnagram, 
    deleteAnagram
};


    

