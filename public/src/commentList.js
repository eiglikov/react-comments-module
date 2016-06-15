'use strict';
// var update = require('react-addons-update');
// var update = React.addons.update;
// import update from 'react-addons-update';

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

  handleEditReact: function(comment) {
    console.log('handleEditReact');
    // console.log(comment);

    this.state.data.forEach((comt, i)=>{
      if (comt._id == comment._id) console.log('Equal objects!');
      if (comt._id == comment._id){
        var newComment = this.state.data.splice(i, 1);
        newComment[0].text = comment.text;
        // console.log(newComment[0]);
        // console.log(comment);
        // this.setState({data: this.state.data});
        this.handleEdit(newComment[0]);
      }
    })
  },

  handleEdit: function(comment) {
    console.log('handleEdit');
    // console.log(comment);
    var comments = this.state.data;
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'PUT',
      data: comment,
      success: function(data) {
        console.log('success');
        console.log(comment);
        this.setState({data: comments});
      }.bind(this),
      error: function(xhr, status, err){
        console.log('error');
        this.setState({data: this.data});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },


  render: function() {
    return (
      <div className="commentBox col-md-10">
        <div className="jumbotron">

            <h2>Comments <i className="glyphicon glyphicon-comment" ></i> </h2>

        </div>

        <CommentList
          data={this.state.data}
          handleDelete={this.deleteComment}
          handleEdit={this.handleEditReact}
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
  handleEdit: function(comment) {
    // console.log(comment);
    this.props.handleEdit(comment);
  },
  render: function() {
    // console.log(this);
    var commentNodes = this.props.data.map((comment) => {
      return (
        <Comment
          author={comment.author}
          text={comment.text}
          key={comment._id}
          id={comment._id}
          handleDelete={()=>{this.props.handleDelete(comment)}}
          handleEdit={this.handleEdit}
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
  getInitialState: function() {
    // console.log(this.props.id);
    return {
      _id: this.props.id,
      author: this.props.author,
      text: this.props.text};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

  rawMarkup: function(text) {
    var rawMarkup = marked(text.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  deleteComment: function(comment) {
    // console.log(this.props.id);
    console.log('Delete');
    if (confirm('Delete this comment?'))
      this.props.handleDelete();
      else {
        return;
      }
  },

  editComment: function(comment) {
    console.log('Update');
    // console.log(this.refs.textInput);
    this.refs.text.style.display = 'none';
    this.refs.textInput.style.display = 'block';
    this.refs.editButton.style.visibility = 'hidden';
    this.refs.saveButton.style.display = 'block';

    this.refs.textInput.focus();
  },

  saveComment: function(comment) {
    console.log('Save');

    comment.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    // console.log(author);
    if (!text || !author) {
      return;
    }
    // console.log(this.state);

    this.refs.text.style.display = 'block';
    this.refs.textInput.style.display = 'none';
    this.refs.saveButton.style.display = 'none';
    this.refs.editButton.style.visibility = 'visible';


    this.props.handleEdit(this.state);
  },


  render: function() {
    // console.log(this);
    return (
      <div className="comment" >
        <h3 className="commentAuthor">
          {this.state.author}
          <button className='editButton close' ref='editButton' onClick={this.editComment} aria-hidden="true">
            <i className="glyphicon glyphicon-pencil" ></i>
          </button>

          <button type="button" className="close" aria-label="Close" onClick={this.deleteComment} ><span aria-hidden="true">&times;</span></button>
        </h3>

        <div className='commentText'>
          <span className='view' ref='text' onDoubleClick={this.editComment} dangerouslySetInnerHTML={this.rawMarkup(this.state.text)} />

          <textarea className='edit' ref='textInput' onSubmit={this.editComment} onBlur={this.saveComment} value={this.state.text} onChange={this.handleTextChange}></textarea>
        </div>


        <button className='btn btn-primary btn-sm saveButton' ref='saveButton' onClick={this.saveComment}>Save</button>


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
