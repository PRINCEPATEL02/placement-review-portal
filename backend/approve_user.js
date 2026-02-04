const mongoose = require('mongoose');
require('dotenv').config();

// Define the Login schema inline to ensure we match the collection structure without dependency issues
const LoginSchema = new mongoose.Schema({
    enrollment: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    last_login: { type: Date },
    role: { type: String, enum: ['student', 'admin'], required: true },
    is_approved: { type: Boolean, default: false }
});

const Login = mongoose.model('Login', LoginSchema);

const approveUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_portal');
        console.log('Connected to MongoDB');

        const enrollment = '230170116045';

        // Find and update
        const result = await Login.updateOne(
            { enrollment: enrollment },
            { $set: { is_approved: true } }
        );

        if (result.matchedCount === 0) {
            console.log(`User with enrollment ${enrollment} not found.`);
        } else if (result.modifiedCount > 0) {
            console.log(`Successfully approved user ${enrollment}.`);
        } else {
            console.log(`User ${enrollment} was already approved.`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit();
    }
};

approveUser();
