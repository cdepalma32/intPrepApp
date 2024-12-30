
const Topic = require('../models/Topic');
const Question = require('../models/InterviewQuestion'); //? if related questions need hanlding

//POST /api/topics
const createTopic = async (req, res) => {
    try {
        const { name, description } = req.body;
        if(!name.trim()) {
            return res.status(400).json({ message: 'Topic name is required.'});
        }
        const newTopic = await Topic.create({ name, description });
        res.status(201).json(newTopic);
    } catch (error) {
        res.status(500).json({ message: 'Error creating topic', error: error.message});
    }
    };


//GET /api/topics
const getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching topics', error: error.message });
    }
    };

//GET /api/topics/:id
const getTopicById= async (req, res) => {
    try {
        const {id } = req.params;
        const topic = await Topic.findById(id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid topic ID.'});
        }
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found'});
        }
        res.status(200).json(topic);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching topic', error: error.message});
    }
};

//PUT /api/topics/:id
const updateTopic = async (req, res) => {
    try{
        const {id } = req.params;
        const { name, description } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid topic ID.'});
        }
        const updatedTopic = await Topic.findByIdAndUpdate(
            id, 
            { name, description },
            { new: true, runValidators: true }
        );
        if (!updatedTopic) {
            return res.status(404).json({ message: 'Topic not found. '});
        }
        res.status(200).json(updatedTopic);
    } catch (error) {
        res.status(500).json({ message: 'Error updating topic', error: error.message});
    }
}; 

const deleteTopic = async (req, res) => {
    try {
        const {id} = req.params;
        const { cascade = true } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid topic ID' });
        }
            if (cascade) {
                await Question.deleteMany({ topic: id });
            }
        const deletedTopic = await Topic.findByIdAndDelete(id);
        if (!deletedTopic) {
            return res.status(404).json({ message: 'Topic not found.'});
        }
        res.status(200).json({ message: 'Topic deleted successfully!'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting topic', error: error.message});
    }
};

module.exports = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic
};