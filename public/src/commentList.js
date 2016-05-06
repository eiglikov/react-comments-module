// CommentBox
let CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []};
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
        console.log(this.state.data);

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
   // TODO: submit to the server and refresh the list
 },
  render: function() {
    return (
      <div className="commentBox">
        <div className="jumbotron">
          <div class="container">
            <h2>Comments</h2>

          </div>
        </div>

        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }

});

// CommentList
let CommentList = React.createClass({
  render: function() {
    console.log(this);
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
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    // TODO: send request to the server
    this.setState({author: '', text: ''});
  },

  render: function() {
    return (
      <form className="commentForm form-horizontal col-md-6" role="form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label className="control-label" htmlFor="name">Name:</label>
          <input type="text" className="form-control" id="name" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange}/>
        </div>

        <div className="form-group">
          <label className="control-label" htmlFor="comment">Comment:</label>
          <textarea type="text" className="form-control" id="comment" placeholder="Comment" value={this.state.text}
            onChange={this.handleTextChange}/>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>

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
  <CommentBox url='/api/comments' pollInterval={2000}/>,
  document.getElementById('content')
);

// ReactDOM.render(CommentBox, 'content');
