const mongoose = require('mongoose');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

async function check() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
        
        const UserSchema = new mongoose.Schema({ idNumber: String });
        const User = mongoose.models.User || mongoose.model('User', UserSchema);
        
        const CollaborationSchema = new mongoose.Schema({
            alumni: mongoose.Schema.Types.ObjectId,
            thesis: mongoose.Schema.Types.ObjectId,
            status: String
        });
        const Collaboration = mongoose.models.Collaboration || mongoose.model('Collaboration', CollaborationSchema);
        
        const user = await User.findOne({ idNumber: 'TUPT-22-2222' });
        if (!user) {
            console.log('User TUPT-22-2222 not found');
        } else {
            console.log('User found:', user._id);
            const collabs = await Collaboration.find({ alumni: user._id });
            console.log('Collabs found:', collabs.length);
            collabs.forEach(c => console.log(`- Thesis: ${c.thesis}, Status: ${c.status}`));
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}
check();
