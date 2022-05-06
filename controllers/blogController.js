const Blog = require('../models/blog');
// blog_index, blog_details, blog_create_get, blog_create_post, blog_delete

const blog_index = (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then((result) => {
            // Pass the array of blogs gotten back from the model (db collection) to the index.ejs view
            res.render('blogs/index', { title: 'All Blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
        })
}

const blog_details = (req, res) => {
    const id = req.params.id; // Access the Route Parameter.
    Blog.findById(id)
        .then((result) => {
            // Render the details view with the data that we got back
            res.render('blogs/details', { blog: result, title: 'Blog Details' });
        })
        .catch((err) => {
            console.log(err);
        })
}

const blog_create_get = (req, res) => {
    res.render('blogs/create', { title: 'Create A New Blog' });
}

const blog_create_post = (req, res) => {
    const blog = new Blog(req.body); // Creating a new instance of blog and passing the form data object into it.

    blog.save()
        .then(result => {
            res.redirect('/blogs'); // Redirect back to the home page after form data has been collected and saved to the db so we can see the newly added blog.
        })
        .catch((err) => {
            console.log(err);
        })
}

const blog_delete = (req, res) => {
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
}

module.exports = {
    blog_index,
    blog_details,
    blog_create_get,
    blog_create_post,
    blog_delete
}