import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({

  text: {type: String, required: true},
  
  image: String,

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],

  likeCount: Number,

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet"
  },

  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet"
    }
  ],
})

const Tweet = mongoose.models.Tweet || mongoose.model("Tweet", tweetSchema);

export default Tweet;