const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "The user must have a Name"],
  },
  email: {
    type: String,
    require: [true, "The user must have a email"],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    require: [true, "The user must have a password"],
    min: [8, "The password must have atleast 8 characters"],
  },
  signUpDate: {
    type: Date,
    default: Date.now(),
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
