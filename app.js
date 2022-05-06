const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { createSocket } = require('dgram');

// Express App
const app = express();

// Connect to MongoDB
const dbURI = 'mongodb+srv://popeemmanuel:popeemmanuel@learning-nodejs.vdqap.mongodb.net/node-tutorial?retryWrites=true&w=majority';

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

// Mongoose and Mongo Sandbox Routes
app.get('/add-blog', (req, res) => {
    // Create a new instance of a blog document and then save that to the blog collection in the db
    const blog = new Blog({
        title: 'New Blog 2',
        snippet: 'About my new blog',
        body: 'More about my new blog'
    });

    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err);
        });
});

//Retrieve all exisiting blog documents in the db collection
app.get('/all-blogs', (req, res) => {
    Blog.find()
        .then((result) => {
            // sends  the result to the browser
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

// Find a single blog in the db collection
app.get('/single-blog', (req, res) => {
    Blog.findById('6273b373bf2b23a807d69dda')
        // We can use .then() and .catch() methods here becuase the Blog model methods find(), save() and findById() are ASYNCHRONOUS
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});


// ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});


// BLOG ROUTES
app.get('/blogs', (req, res) => {
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
app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body); // Creating a new instance of blog and passing the form data object into it.

    blog.save()
        .then(result => {
            res.redirect('/blogs'); // Redirect back to the home page after form data has been collected and saved to the db so we can see the newly added blog.
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create A New Blog' });
})

app.get('/blogs/:id', (req, res) => {
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

app.delete('/blogs/:id', (req, res) => {
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


// 404
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
})