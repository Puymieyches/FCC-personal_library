const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: [String],
    commentcount: { type: Number, default: 0 }
});

const Book = mongoose.model('Book', bookSchema);

exports.Book = Book;
