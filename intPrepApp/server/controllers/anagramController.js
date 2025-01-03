const Anagram = require('../models/Anagram');
const User = require('../models/User');

const getAnagrams = async (req, res) => {
    try {
        const { topicId } = req.params;
        const anagrams = await Anagram.find({ topic: topicId}); // query DB
        res.status(200).json(anagrams); // return fetched anagrams
    } catch (error) {
        console.error('Error fetching anagrams:', error);
        res.status(500).json({error: 'Failed to fetch anagrams.' });
    }

};


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
        const { word, scrambled, solution, topic } = req.body; // extract anagram details from the request body
        // logic to create an anagram
        if (!word || !scrambled || !solution || !topic ) {
            return res.status(400).json({ error: 'All fields are required.'});
        }
    // save to db
    const newAnagram = await Anagram.create({ word, scrambled, solution, topic });
    res.status(201).json(newAnagram); // return created anagram
} catch (error) {
    console.error('Error creating anagram:', error);
    res.status(500).json({ error: 'Failed to create anagram.'});
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


    

