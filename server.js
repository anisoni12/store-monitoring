const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Routes to test server
app.get('/', (req, res) => {
    res.json({message: 'Store Monitoring API is running!'});
});

app.get('/health' , (req, res) => {
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
        });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
