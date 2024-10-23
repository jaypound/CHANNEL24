// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// mongoose.connect('mongodb://localhost:27017/channel24', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })

// mongoose.connect('mongodb+srv://dbUser:Sx1Myj0XEWmUly3N@channel24.uooda.mongodb.net/?retryWrites=true&w=majority&appName=channel24', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB Atlas'))
// .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Error connecting to MongoDB Atlas:', error));

// Schema Definition
const RegistrationSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    company: String,
    address: String,
    city: String,
    state: String,
    zipcode: String,
    email: String,
    primaryPhone: String,
    secondaryPhone: String,
});

const path = require('path');

// Serve static files from the 'public' directory

app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res) => {
        res.set('Cache-Control', 'no-store');
    }
}));


// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Channel 24 Community Access Registration API');
});

app.get('/register-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

const Registration = mongoose.model('Registration', RegistrationSchema);

// API Endpoint to handle registration
app.post('/register', async (req, res) => {
    try {
        console.log(req.body); // Add this line to debug the incoming data
        const newRegistration = new Registration(req.body);
        await newRegistration.save();
        res.status(201).send({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).send({ message: 'Registration failed' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
