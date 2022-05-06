const express = require('express');
const blogController = require('../controllers/blogController');

// Create a new Express router
const router = express.Router();

// BLOG ROUTES
// Renders the home page with all the blogs
router.get('/', blogController.blog_index);

// Post a new Blog document to the database
router.post('/', blogController.blog_create_post);

// Create a new instance of blog and redirects to the home page.
router.get('/create', blogController.blog_create_get)

// Renders the details of the blog post we got back from the db relative to the id that was passed into the route parameter
router.get('/:id', blogController.blog_details);

// Deletes a blog post and redirects back to the home page
router.delete('/:id', blogController.blog_delete);

module.exports = router;