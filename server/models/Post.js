const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: { // For text-based posts
    type: String,
  },
  imageUrl: { // For image posts
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  community: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
  },
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  downvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  // A virtual field to easily get the vote count
  score: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;