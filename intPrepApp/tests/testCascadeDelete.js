// Testing cascade delete functionality
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Topic from '../server/models/Topic.js';
import InterviewQuestion from '../server/models/InterviewQuestion.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/intprepapp';

async function connectDB() {
    try {
        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 10000,// sets a higher timeout
            socketTimeoutMS: 30000, // increase socket timeout
        });
        console.log('Connected to the database for testing!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

    async function testCascadeDelete() {
        try {
            // Step 1 - create a test topic
            const testTopic = await Topic.create({ name: 'Test Cascade', description: 'A topic to test cascade delete functionality. '});

            // Step 2 -  add related interview questions
            await InterviewQuestion.create([
                { question: 'What is cascade delete?', correctAnswer: 'It automatically deletes all related records.', topic: testTopic._id },
                { question: 'Why use cascade delete? ', correctAnswer: 'To maintain referential integrity.', topic: testTopic._id }
            ]);

            // Display count before deleting
            const initialCount = await InterviewQuestion.countDocuments({ topic: testTopic._id });
            console.log(`Questions before deletion: ${initialCount}`);

            // step 3 - delete the topic
            await Topic.findByIdAndDelete(testTopic._id);

            // step 4 - verify that all questions are deleted
            const finalCount = await InterviewQuestion.countDocuments({ topic: testTopic._id });
            console.log(`Questions after deletion: ${finalCount}`);

            // assert if cascade delete worked
            if (finalCount === 0) {
                console.log('Cascade delete successful!');
            } else {
                console.error('Cascade delete failed!');
            }
            } catch (error) {
                console.error('Error during cascade delete test:', error);
            } finally {
                await mongoose.connection.close();
                console.log('Database connetion closed.');
            }
            
        }
        async function runTest() {
            await connectDB();
            await testCascadeDelete();
        }
    
        runTest();