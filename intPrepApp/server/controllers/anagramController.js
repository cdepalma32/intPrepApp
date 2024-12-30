const getAnagrams = async (req, res) => {
    try {
        const { topicId } = req.params; // extract topicId from URL
        // logic to fetch anagrams for the topic
        res.status(200).json({ message: `Anagrams for topic ${topicId} fetched successfully!`});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch anagrams.'});
    }
    };

const submitAnagram = async (req, res) => {
    try {
        const { userId, anagramId, answer } = req.body; // extract necessary data from the request body
        
        // logic to validate the submitted answer
        // for example, fetch the anagram from the database and compare the answer
        const anagram = await Anagram.findById(angramId); // assuming you have an 'Anagram' model
        if (!anagram) {
            return res.status(404).json({ error: 'Anagram not found.'});
        }
        const isCorrect = anagram.correctAnswer === answer;

        // logic for storing the result (if needed)
        // for example, save the user's attempt or update their score
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
        const { word, hints } = req.body; // extract anagram details from the request body
        // logic to create an anagram
        res.status(201).json({ message: 'Anagram created successfully!'});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create anagram.'});
    }
    };

const updateAnagram = async (req, res) => {
    try{
        const { id } = req.params; // extract anagram ID from URL
        // logic to update an existing anagram
        res.status(200).json({ message: `Anagram ${id} updated successfully!`});
    } catch (error) {
        res.status(500).json({ error: 'Failed to update anagram.'});
    }
    };
const deleteAnagram = async (req, res) => {
    try {
        const { id} = req.params; // extract anagrm ID from URL
        const anagram = await Anagram.findByIdAndDelete(id); // check if anagram exists
        if (!anagram) {
            return res.status(404).json({error: 'Anagram not found!'});
        }
        // logic to delete an anagram
        res.status(200).json({ message: `Anagram ${id} deleted successfully!`});
        } catch (error) {
            console.log(error); // logs the error
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


    

