// CommentBox
let CommentBox = React.createClass({
  render: function() {
    return (

      <div className="commentBox">
        <div className="jumbotron">
          <div class="container">
            <h2>Comments</h2>
          </div>
        </div>

        <CommentList data={this.props.data} />
        <CommentForm />
      </div>
    );
  }
});

// CommentList
let CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

// CommentForm
var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});


// Comment
let Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h3 className="commentAuthor">
          {this.props.author}
        </h3>
        {console.log(data)}
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});



ReactDOM.render(
  <CommentBox url="/api/comments" />,
  document.getElementById('content')
);

// ReactDOM.render(CommentBox, 'content');
