// CommentBox
let CommentBox = React.createClass({
  render: function() {
    return (

      <div className="commentBox">
        <div className="jumbotron">
          <div class="container">
            <h1>Comments</h1>
          </div>
        </div>

        <CommentList />
        <CommentForm />
      </div>
    );
  }
});

// CommentList
let CommentList = React.createClass({
  render: function() {
    return (
      <div className="commentList">
        <Comment author="Pete Hunt">This is one comment</Comment>
        <Comment author="Shaw Low">This is *another* comment</Comment>
      </div>
    );
  }
});

// CommentForm
let CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">
        CommentForm
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
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});



ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);

// ReactDOM.render(CommentBox, 'content');
