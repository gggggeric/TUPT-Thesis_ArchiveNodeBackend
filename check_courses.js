const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const thesisSchema = new mongoose.Schema({
    course: String
}, { collection: 'theses' });

const Thesis = mongoose.model('Thesis', thesisSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        const courses = await Thesis.distinct('course');
        console.log('Unique courses in DB:', courses);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
