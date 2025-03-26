// stores the user's progress (which questions have been reviewed/which anagram groups a user has completed)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator'); // Import the validator package


const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique:  true, index: true, validate: [validator.isEmail, 'Invalid email format'] },
    password: { type: String, required: true, select: false },
    role: { type: String, default: 'user'},
    reviewedQuestions: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewQuestion', default: []}
    ],
    completedAnagrams: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Anagram', default: []}
    ],
    isAdmin: { type: Boolean, default: false } 
}, {timestamps: true}); 



// password hashing pre-save middleware
userSchema.pre('save' , async function(next) {
        if (this.isModified("password")) {
        // Prevent double hashing
        const bcryptHashRegex = /^\$2[aby]\$\d{2}\$/; 
        
        if (!bcryptHashRegex.test(this.password)) {
            console.log("Hashing password before saving...");
            this.password = await bcrypt.hash(this.password,10);
        } else {
            console.log("Password is already hashed, skipping hashing...");
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