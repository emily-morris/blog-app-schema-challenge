'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// schema to represent authors
const authorSchema = mongoose.Schema({
  firstName: 'string',
  lastName: 'string',
  userName: {
    type: 'string',
    unique: true
  }
});

const commentSchema = mongoose.Schema({ content: 'string' });

const postSchema = mongoose.Schema({
  title: 'string',
  content: 'string',
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  comments: [commentSchema]
});

postSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

postSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

postSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

postSchema.methods.serialize = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    comments: this.comments
  };
};

const Author = mongoose.model('Author', authorSchema);
const Post = mongoose.model('Blogpost', postSchema);

module.exports = {Author, Post};