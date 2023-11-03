// Add all consts, required items
const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;
const path = require('path');
const ExpressHandlebars = require('express-handlebars');
const mysql = require('mysql2/promise');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Create a Handlebars engine
app.engine('handlebars', ExpressHandlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'public', 'views'));

// Database configuration
const db = mysql.createPool({
    host: 'localhost',
    user: 'dully',
    password: '@Turtle122302',
    database: 'tattoodb'
});

// Route to serve the home page
app.get('/', (req, res) => {
    res.render('index');
});

// Route to serve the index page
app.get('/index', (req, res) => {
    res.render('index'); 
});


// Route to serve the about page
app.get('/about', (req, res) => {
    res.render('about');
});

// Route to serve the appointments page
app.get('/appointments-table', async (req, res) => {
    try {
        // Fetch data from the database
        const [rows, fields] = await db.query('SELECT * FROM appointments');
        const appointments = rows;

        // Render the Handlebars template and pass the data
        res.render('appointments-table', { appointments });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to serve the schedule page
app.get('/schedule', (req, res) => {
    res.render('schedule');
});

// Route to handle appointment scheduling form submission
app.post('/schedule', async (req, res) => {
    // Extract form data
    const { name, email, service, date, time } = req.body;

    // Insert the appointment data into the database
    try {
        await db.query('INSERT INTO appointments (name, email, service, date, time) VALUES (?, ?, ?, ?, ?)', [name, email, service, date, time]);
        res.send('Appointment scheduled successfully!');
    } catch (err) {
        console.error('Error scheduling appointment:', err);
        res.status(500).send('Internal Server Error');
    }
});


// CURRENTLY GET A 401 error (unauthorized)
app.get('/unsplash', async (req, res) => {
    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            headers: {
                Authorization: 'SsILXvkuLzqoV4iL6OYy2e9HvmuqH5Os9aAHVEdI4X0',
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (imageUrl) {
                res.render('unsplash', { image: imageUrl }); // Render 'unsplash' template with fetched image URL
            } else {
                res.status(500).json({ error: 'Image URL not found' });
            }
        } else {
            throw new Error('Failed to fetch images');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
