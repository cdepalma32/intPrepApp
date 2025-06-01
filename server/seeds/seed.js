require('dotenv').config(); // load env
const mongoose = require('mongoose');

// Importing models
const Topic = require('../models/Topic');
const InterviewQuestion = require('../models/InterviewQuestion');
const Anagram = require('../models/Anagram');
const User = require('../models/User');

// use the same connection string logic
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intprepapp';

// Connect to MongoDB using environment variables
async function connectDB() {
    try {
        await mongoose.connect(connectionString); // No deprecated options
        console.log('Connected to the database!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process if connection fails
    }
}

// Seed function
async function seed() {
    try {
        // Remove all existing data (ensuring a fresh start each time the seed script is run)
        console.log('Clearing existing data...');
        await Topic.deleteMany({});
        await InterviewQuestion.deleteMany({});
        await Anagram.deleteMany({});
        await User.deleteMany({});
        console.log('Database cleared!');

        // Seed topics
        const topics = await Topic.create([
            { name: 'JavaScript', description: 'Interview questions related to JavaScript' },
            { name: 'React', description: 'Interview questions related to React' },
            { name: 'Node.js', description: 'Interview questions related to Node.js' },
            { name: 'MongoDB', description: 'Interview questions related to MongoDB' },
            { name: 'Express', description: 'Interview questions related to Express' },
        ]);
        console.log(`Seeded ${topics.length} topics!`);

        // Seed interview questions
        const questions = await InterviewQuestion.create([
            // JavaScript
            { question: 'What is the difference between `let`, `var`, and `const`?', correctAnswer: 'Let and const are block-scoped, var is function-scoped.', topic: topics[0]._id },
            { question: 'How does prototypal inheritance work in JavaScript?', correctAnswer: 'Objects inherit properties and methods from their prototype.', topic: topics[0]._id },
            { question: 'What are promises, and how are they different from callbacks?', correctAnswer: 'Promises represent future values, callbacks are functions passed as arguments.', topic: topics[0]._id },
            { question: 'What is the purpose of the `this` keyword in JavaScript?', correctAnswer: 'Refers to the current object or context.', topic: topics[0]._id },
            { question: 'Explain the difference between `==` and `===`.', correctAnswer: '== compares values with type coercion, === compares both values and type.', topic: topics[0]._id },

            // React
            { question: 'What is the virtual DOM, and how does it work?', correctAnswer: 'A lightweight copy of the real DOM that updates efficiently.', topic: topics[1]._id },
            { question: 'What are React Hooks, and why are they useful?', correctAnswer: 'Functions that allow state and lifecycle management in functional components.', topic: topics[1]._id },
            { question: 'How do you handle state in a React application?', correctAnswer: 'Using useState hook or state management libraries (e.g., Redux).', topic: topics[1]._id },
            { question: 'What are the differences between controlled and uncontrolled components?', correctAnswer: 'Controlled componenets have their state managed by React, uncontrolled are managed by the DOM.', topic: topics[1]._id },
            { question: 'How does React handle component re-rendering?', correctAnswer: 'Re-renders when state or props change.', topic: topics[1]._id },

            // Node.js
            { question: 'What is the difference between `process.nextTick()` and `setImmediate()`?', correctAnswer: 'process.nextTick() runs after the current operation, setImmediate() runs in the next event loop cycle.', topic: topics[2]._id },
            { question: 'Explain how event-driven programming works in Node.js.', correctAnswer: 'Node.js uses an event loop to handle asynchronous events and callbacks.', topic: topics[2]._id },
            { question: 'What are streams in Node.js, and how are they used?', correctAnswer: 'Streams are used to read and write data in chunks, e.g., file operations.', topic: topics[2]._id },
            { question: 'How does Node.js handle file I/O operations?', correctAnswer: 'Node.js uses asynchronous, non-blocking file system methods.', topic: topics[2]._id },
            { question: 'What is middleware in the context of Node.js?', correctAnswer: 'Functions that process requests before reaching the route handler.', topic: topics[2]._id },

            // MongoDB
            { question: 'What are the advantages of using MongoDB over relational databases?', correctAnswer: 'Flexible schema, horizontal scalability, JSON-like documents.', topic: topics[3]._id },
            { question: 'How does MongoDB handle indexing?', correctAnswer: 'Indexes speed up query performance.', topic: topics[3]._id },
            { question: 'What is the purpose of the `ObjectId` in MongoDB?', correctAnswer: 'A unique identifier for documents in a collection.', topic: topics[3]._id },
            { question: 'Explain how replication works in MongoDB.', correctAnswer: 'Data is duplicated across multiple servers to ensure availability.', topic: topics[3]._id },
            { question: 'What are aggregation pipelines in MongoDB?', correctAnswer: 'A framework for processing data and performing operations like filtering, grouping, and sorting.', topic: topics[3]._id },

            // Express
            { question: 'What is middleware in Express, and how is it used?', correctAnswer: 'Functions that modify requests and responses in the request-response cycle.', topic: topics[4]._id },
            { question: 'How do you handle error handling in Express applications?', correctAnswer: 'Using error-handling middleware with four parameters (err, req, res, next).', topic: topics[4]._id },
            { question: 'What is the difference between `app.use()` and `app.get()` in Express?', correctAnswer: 'app.use() defines middleware, app.get() defines route handlers.', topic: topics[4]._id },
            { question: 'How do you define a dynamic route in Express?', correctAnswer: 'By using :param in the route path, e.g., /user/:id.', topic: topics[4]._id },
            { question: 'How can you secure an Express application?', correctAnswer: 'Use HTTPS, middleware like helmet, and sanitize user inputs.', topic: topics[4]._id },
        ]);
        console.log(`Seeded ${questions.length} interview questions!`);

        // Seed anagrams with topic references
        const anagrams = await Anagram.create([
           // JavaScript
{ word: 'functionality', scrambled: 'tinofyluaitcn', solution: 'functionality', topic: topics[0]._id },
{ word: 'encapsulation', scrambled: 'slencuaotnpia', solution: 'encapsulation', topic: topics[0]._id },
{ word: 'event listener', scrambled: 'nteev ilretsen', solution: 'event listener', topic: topics[0]._id },
{ word: 'concurrency', scrambled: 'ncnoyrurce', solution: 'concurrency', topic: topics[0]._id },
{ word: 'prototype', scrambled: 'toyrpeotp', solution: 'prototype', topic: topics[0]._id },

// React
{ word: 'component', scrambled: 'tenopcmno', solution: 'component', topic: topics[1]._id },
{ word: 'state management', scrambled: 'atset aanmegnet', solution: 'state management', topic: topics[1]._id },
{ word: 'lifecycle', scrambled: 'clieyfelc', solution: 'lifecycle', topic: topics[1]._id },
{ word: 'reducer', scrambled: 'ceredur', solution: 'reducer', topic: topics[1]._id },
{ word: 'reconciliation', scrambled: 'ialotnconceiri', solution: 'reconciliation', topic: topics[1]._id },

// Node.js
{ word: 'asynchronous', scrambled: 'uosrsycuhoan', solution: 'asynchronous', topic: topics[2]._id },
{ word: 'event emitter', scrambled: 'tivmetetreen', solution: 'event emitter', topic: topics[2]._id },
{ word: 'buffer stream', scrambled: 'rfefub etrams', solution: 'buffer stream', topic: topics[2]._id },
{ word: 'middleware', scrambled: 'emladrewiwl', solution: 'middleware', topic: topics[2]._id },
{ word: 'cluster', scrambled: 'curlets', solution: 'cluster', topic: topics[2]._id },

// MongoDB
{ word: 'replication', scrambled: 'anictieolpr', solution: 'replication', topic: topics[3]._id },
{ word: 'aggregation', scrambled: 'gionatgraeg', solution: 'aggregation', topic: topics[3]._id },
{ word: 'document', scrambled: 'mcuetnod', solution: 'document', topic: topics[3]._id },
{ word: 'sharding', scrambled: 'idnsarhg', solution: 'sharding', topic: topics[3]._id },
{ word: 'indexes', scrambled: 'xdeenis', solution: 'indexes', topic: topics[3]._id },

// Express
{ word: 'routing', scrambled: 'itgunor', solution: 'routing', topic: topics[4]._id },
{ word: 'middleware', scrambled: 'emwdilarel', solution: 'middleware', topic: topics[4]._id },
{ word: 'dynamic route', scrambled: 'cinmday teuor', solution: 'dynamic route', topic: topics[4]._id },
{ word: 'http headers', scrambled: 'ttpd sehhaer', solution: 'http headers', topic: topics[4]._id },
{ word: 'authentication', scrambled: 'ainuthnctiateo', solution: 'authentication', topic: topics[4]._id },
        ]);
        console.log(`Seeded ${anagrams.length} anagrams!`);

        // Optionally seed users
        const users = await User.create([
            { username: 'testuser', email: 'test@example.com', password: 'password123' },
        ]);
        console.log(`Seeded ${users.length} users!`);
    } catch (err) {
        console.error('Error while seeding:', err);
    throw err; //rethrows error to handle it in main()
    }
}

async function main() {
    try {
    await connectDB(); // connect to database
    await seed(); // run seed function
} catch (err) {
    console.error('Unexpected error during seeding:', err);
} finally {
    await mongoose.connection.close(); // close DB connection
    console.log('Database connection closed.');
}
}

main();
