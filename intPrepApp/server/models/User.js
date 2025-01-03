// stores the user's progress (which questions have been reviewed/which anagram groups a user has completed)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // Import the validator package


const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique:  true, index: true, validate: [validator.isEmail, 'Invalid email format'] },
    password: { type: String, required: true },
    reviewedQuestions: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewQuestion', default: []}
    ],
    completedAnagrams: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Anagram', default: []}
    ],
}, {timestamps: true}); 



// password hashing pre-save middleware
userSchema.pre('save' , async function(next) {
    if (this.isNew || this.isModified('password')) {
        try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        } catch(err) {
    return next(err); // passes err to Mongoose's error handler
        }
    }
    next();
});

// method for password comparison
userSchema.methods.isCorrectPassword = async function (password) {
    try {
    return bcrypt.compare(password, this.password);
    } catch (err) {
        throw new Error('Password comparison failed');
    }
};


const User = mongoose.model('User', userSchema);

module.exports = User;