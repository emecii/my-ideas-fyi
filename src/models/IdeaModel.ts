import mongoose, { Schema } from "mongoose";

// Define Mongoose schema for Vote
const VoteSchema = new Schema({
    productRequestId: String,
    voted: String,
  });

// Define Mongoose schema for User
const UserSchema = new Schema({
    image: String,
    name: String,
    username: String,
    votes: [VoteSchema],
  });

// Define Mongoose schema for CommentReply
const CommentReplySchema = new Schema({
  id: String,
  content: String,
  replyingTo: String,
  user: UserSchema,
});

// Define Mongoose schema for Comment
const CommentSchema = new Schema({
  id: String,
  content: String,
  user: UserSchema,
  replies: [CommentReplySchema],
});

// Define Mongoose schema for Idea
const IdeaSchema = new Schema({
  id: String,
  title: String,
  category: String,
  upvotes: Number,
  status: String,
  description: String,
  comments: [CommentSchema],
});


// Create Mongoose models
export const IdeaModel = mongoose.model("Idea", IdeaSchema);
export const UserModel = mongoose.model("User", UserSchema);
