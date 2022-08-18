const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const { promisify } = require("util");
const AppError = require("../utils/appError");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const token = generateToken(newUser._id);
    newUser.password = undefined;
    res.status(201).send({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Email or Password is Invalid", 400));
    }
    let checkPassword = await bycrypt.compare(password, user.password);
    if (!checkPassword) {
      return next(new AppError("Email or Password is Invalid", 400));
    }
    const token = generateToken(user._id);
    user.password = undefined;
    res.status(200).send({
      status: "success",
      token: token,
      user,
    });
  } catch (err) {
    return next(new AppError("Something went Wronge", 500));
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("Something went Wronge", 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const findUser = await User.findById(decoded.id);
    if (!findUser) return next(new AppError("The user doesn't Exist", 401));
    next();
  } catch (err) {
    return next(new AppError("Something went Wronge", 500));
  }
};
