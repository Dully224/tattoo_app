// Add all consts, required items
const express = require('express');
const app = express();
const axios = require('axios');
const port = 3000;
const path = require('path');
const ExpressHandlebars = require('express-handlebars');
const mysql = require('mysql2/promise');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { auth , requiresAuth } = require('express-openid-connect');

// Use public dir
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Use cookie parser
app.use(cookieParser());

// Use sessions
app.use(session({
    secret: '12345abcde', 
    resave: false,
    saveUninitialized: false
}));

// config for auth0
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: '12345abcde',
    baseURL: 'http://localhost:3000',
    clientID: 'R4Q6p1PcP1hG3Nw0IiCtrd0xrXbAY5NE',
    issuerBaseURL: 'https://dev-s7zgfjc1ul0bf3yv.us.auth0.com'
  };
  
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));

// Create a Handlebars engine
app.engine('handlebars', ExpressHandlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'public', 'views'));

// Middleware to set up a user session
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = {
            username: 'Guest'
        };
    }
    
    // Set a cookie named 'user' with the username
    res.cookie('user', req.session.user.username);
    
    next();
});


// Database configuration
const db = mysql.createPool({
    host: 'localhost',
    user: 'dully',
    password: '@Turtle122302',
    database: 'tattoodb'
});

// Middleware to require authentication for all routes
app.use(requiresAuth());

// Route to serve the home page
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
});

// req.isAuthenticated is provided from the auth router
app.get('/login', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  });

// Route to serve the index page
app.get('/index', (req, res) => {
    res.render('index', { user: req.session.user }); 
});

// Route to serve the about page
app.get('/info', (req, res) => {
    res.render('info', { user: req.session.user });
});

// Route to serve the appointments page
app.get('/appointments-table' , requiresAuth(),  async (req, res) => {
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
app.get('/schedule' , requiresAuth(), (req, res) => {
    res.render('schedule', { user: req.session.user }) , { user: req.openid.user };
});

// Route to handle appointment scheduling form submission
app.post('/schedule', async (req, res) => {
    
    // Extract form data
    const { name, email, service, date, time } = req.body;

    // Insert the appointment data into the database
    try {
        await db.query('INSERT INTO appointments (name, email, service, date, time) VALUES (?, ?, ?, ?, ?)', [name, email, service, date, time]);
        res.send('Appointment scheduled successfully! See you then!');
    } catch (err) {
        console.error('Error scheduling appointment:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Create API route -> 50 refeshes per hour (Unsplash limit)
app.get('/unsplash', requiresAuth(), async (req, res) => {
    try {
        const accessKey = 'SsILXvkuLzqoV4iL6OYy2e9HvmuqH5Os9aAHVEdI4X0'
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            headers: {
                Authorization: `Client-ID ${accessKey}` // Line provided by Unsplash
            }
        });

        const imageUrl = response.data.urls && response.data.urls.regular; // Line provided by Unsplash

        if (imageUrl) {
            res.render('unsplash', { image: imageUrl }); // Pull image
        } else {
            res.status(500).json({ error: 'Image URL not found' }); // error if no image is found
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// 500
app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500)
    res.render('500')
})

// 404
app.use((req, res, next) => {
    res.status(404)
    res.render('404')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});