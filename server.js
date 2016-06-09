
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Comments');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var commentSchema = null,
CommentModel = null;

db.once('open', function() {
  console.log('connected to DB!');

  commentSchema = mongoose.Schema({
    author: String,
    text:   String
  });
  CommentModel = mongoose.model('Comment', commentSchema);
});

// var first = new CommentModel({author: 'Erik', text: 'AAAAA!'});
// console.log(first);
// first.save(function (err, first) {
//   if (err) return console.error(err);
//   console.log('INSERTED!');

// CommentModel.remove({});
// });

var app = express();

var COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/api/comments', function(req, res) {
  CommentModel.find(function (err, comments) {
    if (err) return console.error(err);
    console.log(comments);
    res.send(comments);
  });
});

app.post('/api/comments', function(req, res) {
  var newComment = new CommentModel({
    author: req.body.author,
    text: req.body.text,
  });

  newComment.save(function(err, comment) {
    if (err) return console.error(err);
    console.log(comment);
  });
});



app.delete('/api/comments', function(req, res) {
  console.log('SERVER DELETE');

  var id = req.params;
  console.log(id);
  // CommentModel.findById(id, function(err, comment) {
  //   if(err) return console.error(err);
  //   console.log(comment);
  //   comment.remove(function(err) {
  //     if(err) return console.error(err);
  //   });
  // });

  // fs.readFile(COMMENTS_FILE, function(err, data) {
  //   if (err) {
  //     console.error(err);
  //     process.exit(1);
  //   }
  //   var comments = JSON.parse(data);
  //   var val = req.body.id;
  //
  //   comments.forEach((comt, i) => {
  //
  //
  //     if (comt.id == val) {
  //       console.log('Before ---->\n');
  //       console.log(comments);
  //       console.log(comments[i]);
  //       // console.log(`${comments[i]} - DATA`);
  //       // delete comments[i];
  //       comments.splice(i, 1);
  //
  //       // comments.remove(i)
  //       console.log('AFTER ---->\n');
  //       console.log(comments);
  //
  //       console.log(`Data ${comt.author} deleted`);
  //
  //
  //       fs.writeFile(COMMENTS_FILE, JSON.stringify(comments), function(err) {
  //         if (err) {
  //           console.error(err);
  //           process.exit(1);
  //         }
  //         console.log(comments);
  //         res.json(comments);
  //       });
  //     }
  //   });
  // });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
