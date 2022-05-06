const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema - Structure in which types of data are stored
const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, { timestamps: true });

//Create a model. It wraps the Schema and provides the interface by which we communicate with a db collection
// Model names typically starts with a capital letter.
// First argument in the model method is the name of the model.
// Mongoose will take the name of the model, pluralise it and look for that collection in the db whenever we use the model to communicate with the db in the future.
// Second argument is the schema we wanna base the model on, what type of objects are we gonna store inside the collection.

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;