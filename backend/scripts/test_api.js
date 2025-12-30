const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/luxurystay';
const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // Fallback if not in env, but it should be

const testApi = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Find the guest User (Zainab)
        // We know her ID from previous logs: 6938614ebf8adeca187e742f, but let's find by name to be dynamic
        // Or just find ANY guest
        const user = await mongoose.model('User', new mongoose.Schema({
            firstName: String,
            lastName: String,
            email: String,
            role: String
        })).findOne({ role: 'guest' });

        if (!user) {
            console.log('❌ No guest user found.');
            process.exit();
        }

        console.log(`👤 Found Guest: ${user.firstName} ${user.lastName} (${user._id})`);

        // 2. Generate Token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: '30d'
        });
        console.log('🔑 Generated Test Token');

        // 3. Call API
        const url = 'http://localhost:5000/api/billing';
        console.log(`📡 Calling GET ${url}...`);

        try {
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ API Response Status:', response.status);
            console.log('📦 Bills Found:', response.data.count);
            if (response.data.bills && response.data.bills.length > 0) {
                console.log('📄 First Bill ID:', response.data.bills[0]._id);
            } else {
                console.log('⚠️ No bills returned by API.');
            }

        } catch (apiError) {
            console.error('❌ API Call Failed:', apiError.message);
            if (apiError.response) {
                console.error('   Status:', apiError.response.status);
                console.error('   Data:', apiError.response.data);
            }
        }

    } catch (error) {
        console.error('❌ Script Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

testApi();
