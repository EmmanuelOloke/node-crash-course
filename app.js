require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

// Express App
const app = express();

// Connect to MongoDB
const dbURI = process.env.DB_URL;

// The second argument here stops the DEPRECATION ERRORS.
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// Register View Engine (EJS)
app.set('view engine', 'ejs');

// Middleware and Static Files
app.use(express.static('public'));

// Middleware that helps get access to all data coming from the create new blog form. Takes all the URL Encoded data coming
app.use(express.urlencoded({ extended: true }));
// from the form and passes that into an object we can use on the REQUEST object in app.post blog route.

app.use(morgan('dev'));

// ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// BLOG ROUTES
app.use('/blogs', blogRoutes); // Here we are scoping the route out to /blogs so we don't have to write /blogs again in blogRoutes.js

// 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
})