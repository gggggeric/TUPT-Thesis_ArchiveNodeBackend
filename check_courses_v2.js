const mongoose = require('mongoose');
require('dotenv').config();

const thesisSchema = new mongoose.Schema({
    course: String
}, { collection: 'theses' });

const Thesis = mongoose.model('Thesis', thesisSchema);

async function check() {
    try {
        const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
        await mongoose.connect(connectionString);
        console.log('✅ Connected to MongoDB');
        const courses = await Thesis.distinct('course');
        console.log('COURSES:', JSON.stringify(courses));
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

check();
