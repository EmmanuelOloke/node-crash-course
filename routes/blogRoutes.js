const express = require('express');
const Blog = require('../models/blog');

// Create a new Express router
const router = express.Router();

// BLOG ROUTES
router.get('/', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            // Pass the array of blogs gotten back from the model (db collection) to the index.ejs view
            res.render('index', { title: 'All Blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
        })
});

// Post a new Blog document to the database
router.post('/', (req, res) => {
    const blog = new Blog(req.body); // Creating a new instance of blog and passing the form data object into it.

    blog.save()
        .then(result => {
            res.redirect('/blogs'); // Redirect back to the home page after form data has been collected and saved to the db so we can see the newly added blog.
        })
        .catch((err) => {
            console.log(err);
        })
});

router.get('/create', (req, res) => {
    res.render('create', { title: 'Create A New Blog' });
})

router.get('/:id', (req, res) => {
    const id = req.params.id; // Access the Route Parameter.
    Blog.findById(id)
        .then((result) => {
            // Render the details view with the data that we got back
            res.render('details', { blog: result, title: 'Blog Details' });
        })
        .catch((err) => {
            console.log(err);
        })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result => {
            // We cannot do a redirect here because we're receiving an AJAX request from the frontend (details.ejs), so we have to send a JSON file back to the browser in NodeJS.
            // We are going to send a JSON data back to the browser after deleting and that JSON data will have a redirect property (URL to where we wanna redirect to).
            res.json({ redirect: '/blogs' })
        })
        .catch((err) => {
            console.log(err);
        })
});

module.exports = router;