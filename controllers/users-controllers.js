const httpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new httpError("Something went wrong, cannot fetch users");
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new httpError("Invalid input passed", 422));
  }
  const { name, email, password, image } = req.body;

  let existingUser;
  try {
    existingUser = User.findOne({ email: email });
  } catch (err) {
    const error = new httpError("Something went wrong, findOne failed");
    return next(error);
  }

  if (existingUser) {
    const error = new httpError("User already exists", 422);
  }

  const newUser = new User({
    name: name,
    email: email,
    password: password,
    image: image,
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new httpError("Something went wrong, cannot create user");
    return next(error);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new httpError("Something went wrong, findOne login failed");
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    return next(new httpError("Wrong credentials", 401));
  }

  res.json({ message: "You are logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
