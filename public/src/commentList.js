'use strict';
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
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)

      // this.serverRequest = $.get(this.props)
    });

  },
  handleCommentSubmit: function(comment) {
    // this.preventDefault();
    var comments = this.state.data;
    console.log(comment);
    // this.setState({data: comments});

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.loadCommentsFromServer();

  },


  removeCommentFromDb: function(comment) {
    console.log(comment);
    var comments = this.state.data;
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'DELETE',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  deleteComment: function(comment) {
    console.log('CommentBox');
    // {console.log(comment);}
    // {console.log(this.state.data);}

    this.state.data.forEach((comt, i)=>{
      console.log(comt._id == comment._id);
      if (comt._id == comment._id){
        this.state.data.splice(i, 1);
        // console.log(comment);
        this.setState({data: this.state.data});
        this.removeCommentFromDb(comt);
      }
    })
  },
  handleEdit: function(comment) {
    console.log(comment);
    var comments = this.state.data;
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'PUT',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <div className="jumbotron">
          <div class="container">
            <h2>Comments</h2>

          </div>
        </div>

        <CommentList data={this.state.data} handleDelete={this.deleteComment} handleEdit={this.handleEdit}
          />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }

});

// CommentList
let CommentList = React.createClass({
  getInitialState: function(){
    return {data: []};
  },

  render: function() {
    // console.log(this);
    var commentNodes = this.props.data.map((comment) => {
      return (
        <Comment
          author={comment.author}
          text={comment.text}
          key={comment._id} handleDelete={()=>{this.props.handleDelete(comment)}}
          handleEdit={()=>{this.props.handleEdit(comment)}}
          >
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

// Comment
let Comment = React.createClass({

  rawMarkup: function(text) {
    var rawMarkup = marked(text.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  deleteComment: function(comment) {
    // console.log(this.props.id);
    console.log('Delete');
    this.props.handleDelete();
  },

  updateComment: function(comment) {
    console.log('Update');
    this.props.handleEdit();
  },

  render: function() {
    // console.log(this);
    return (
      <div className="comment">
        <h3 className="commentAuthor">
          {this.props.author}
        </h3>
        <span dangerouslySetInnerHTML={this.rawMarkup(this.props.text)} />
        <button className='btn btn-default' onClick={this.updateComment}>Edit</button>
        <button className='btn btn-danger' onClick={this.deleteComment} disabled>Delete</button>
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
    this.props.onCommentSubmit({author: author, text: text});
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




ReactDOM.render(
  <CommentBox url='/api/comments' pollInterval={2000}/>,
  document.getElementById('content')
);

// ReactDOM.render(CommentBox, 'content');
