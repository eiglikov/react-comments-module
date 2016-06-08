
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
  console.log('DATABASE!');

  commentSchema = mongoose.Schema({
    author: String,
    text:   String
  });

  var CommentModel = mongoose.model('Comment', commentSchema);
  var first = new CommentModel({author: 'Erik', text: 'AAAAA!'});
  console.log(first);
  first.save(function (err, first) {
    if (err) return console.error(err);
    console.log('INSERTED!');
  });


  CommentModel.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
  });
  // CommentModel.remove({});

});

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
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    // NOTE: In a real implementation, we would likely rely on a database or
    // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
    // treat Date.now() as unique-enough for our purposes.
    var newComment = {
      id: Date.now(),
      author: req.body.author,
      text: req.body.text,
    };
    comments.push(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});

app.delete('/api/comments', function(req, res) {
  // var id = req.params.id;
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    var val = req.body.id;
    console.log('SERVER DELETE');

    comments.forEach((comt, i) => {
      // console.log(comt.id == val);
      if (comt.id == val) {
        console.log('Before ---->\n');
        console.log(comments);
        console.log(comments[i]);
        // console.log(`${comments[i]} - DATA`);
        // delete comments[i];
        comments.splice(i, 1);

        // comments.remove(i)
        console.log('AFTER ---->\n');
        console.log(comments);

        console.log(`Data ${comt.author} deleted`);


        fs.writeFile(COMMENTS_FILE, JSON.stringify(comments), function(err) {
          if (err) {
            console.error(err);
            process.exit(1);
          }
          console.log(comments);
          res.json(comments);
        });
      }
    });
  });



});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
