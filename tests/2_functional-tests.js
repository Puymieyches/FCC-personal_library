const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let testbookTitle = 'Book Test';
    let testComment = 'Comment Test';
    let testFakeBookId = '69ca6276f788c4001399a5be';
    let testValidBookId;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
          chai.request(server)
            .post('/api/books')
            .send({ title: testbookTitle })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              testValidBookId = res.body._id;
              assert.property(res.body, 'title', 'object has title property');
              assert.property(res.body, '_id', 'object has _id property');
              assert.equal(res.body.title, testbookTitle, 'book title should match input');
              done();
            });
      });
      
      test('Test POST /api/books with no title given', function(done) {
          chai.request(server)
            .post('/api/books')
            .send({})
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field title');
              done();
            });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
          chai.request(server)
            .get('/api/books')
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body, 'response should be an array (of objects)');
              res.body.forEach(book => {
                assert.isObject(book, 'item in array is an object');
                assert.property(book, 'title', 'object has title property');
                assert.property(book, '_id', 'object has _id property');
                assert.property(book, 'comments', 'object has comments property');
                assert.property(book, 'commentcount', 'object has commentcount propery');
              });
              done();
            });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai.request(server)
            .get(`/api/books/${testFakeBookId}`)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
              done();
            });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
            .get(`/api/books/${testValidBookId}`)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'title', 'object has title property');
              assert.property(res.body, '_id', 'object has _id property');
              assert.equal(res.body._id, `${testValidBookId}`, 'book id should match input id');
              assert.property(res.body, 'comments', 'object has comments property');
              assert.property(res.body, 'commentcount', 'object has commentcount propery');
              done();
            });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
          chai.request(server)
            .post(`/api/books/${testValidBookId}`)
            .send({ comment: testComment })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, 'title', 'object has title property');
              assert.property(res.body, '_id', 'object has _id property');
              assert.property(res.body, 'comments', 'object has comments property');
              assert.isArray(res.body.comments, 'comments property should be an array');
              assert.isTrue(res.body.comments.includes(testComment), 'Comments array should contain new comment');
              done();
            });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
          chai.request(server)
            .post(`/api/books/${testValidBookId}`)
            .send({})
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'missing required field comment');
              done();
            });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
          chai.request(server)
            .post(`/api/books/${testFakeBookId}`)
            .send({ comment: testComment })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
              done();
            });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
          chai.request(server)
            .delete(`/api/books/${testValidBookId}`)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'delete successful');
              done();
            });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
          chai.request(server)
            .delete(`/api/books/${testFakeBookId}`)
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, 'no book exists');
              done();
            });
      });

    });

  });

});
