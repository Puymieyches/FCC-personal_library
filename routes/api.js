'use strict';

const Book = require('../DatabaseSetup/db-schemas').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){

      try {
        const allBooks = await Book.find({});
        
        return res.send(allBooks);

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "No idea where the arrray of books is??" });
      }

    })
    
    .post(async function (req, res){
      let title = req.body.title;
      
      if (!title) {
        return res.send("missing required field title");
      }
      
      try {

        const newBook = new Book({ title: title });
        await newBook.save();
        return res.json({ _id: newBook._id, title: newBook.title });

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Could not save the book" });
      }
    })
    
    .delete(async function(req, res){
      
      try {

        await Book.deleteMany({});

        return res.send("complete delete successful");

      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Could not delete all books" });
      }


    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;

      try {

        const currBook = await Book.findById(bookid);
        if (!currBook) {
          return res.send("no book exists");
        }

        return res.json(currBook);

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Could not get book information" });
      }

    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send("missing required field comment");
      }
      
      try {

        const currBook = await Book.findById(bookid);
        if (!currBook) {
          return res.send("no book exists");
        }

        currBook.comments.push(comment);

        currBook.commentcount = currBook.comments.length;
      
        await currBook.save();

        return res.json({
          _id: bookid,
          title: currBook.title,
          comments: currBook.comments
        })

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Could not save the comment" });
      }

    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      
      if (!bookid) {
        return res.send("invalid book id");
      }

      try {

        const deletedBook = await Book.findByIdAndDelete(bookid);

        if (!deletedBook) {
          return res.send("no book exists");
        }
        return res.send("delete successful")

      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Could not delete the book" });
      }

    });
  
};
