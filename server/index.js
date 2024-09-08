const express = require('express');
const cors = require('cors');
const app = express();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const User = mongoose.model('users', UserSchema);
mongoose.connect('mongodb://0.0.0.0:27017/CyberDetective')
    .then(() => {
        console.log('Connected to CyberDetective database');
    }).catch((err) => {
        console.error('Connection error:', err);
    });

app.use(express.json());
app.use(cors());

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send("Invalid username");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid password");
        }

        res.status(200).send("Login successful");
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Internal server error");
    }
});

app.post("/register", async (req, res) => {
    const { name, email, username, password } = req.body;
    console.log(name, email, username, password);

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send("Username already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });

        const result = await newUser.save();
        console.log(result.toObject());
        res.status(200).send("Registration successful");
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send("Internal server error");
    }
});


app.get("/", (req, res) => {
    res.send("Backend is working");
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})