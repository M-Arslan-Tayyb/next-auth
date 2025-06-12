import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: function (this: any) {
      return !this.googleId;
    },
  },
  image: {
    type: String,
  },
  googleId: {
    type: String,
  },
});

const User = models?.User || model("User", userSchema); 
export default User;
