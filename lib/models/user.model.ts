import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  id: {type: String, required: true},
  name: {type: String, required: true},
  username: {type: String, required: true, unique: true},

  bio: String,
  image: String,

  onboarded: {
    type: Boolean,
    default: false
  },

  tweets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet"
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;