const { v4: uuid } = require("uuid");
const httpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Youcef SB",
    email: "youcef4tak@gmail.com",
    password: "testers",
  },
  {
    id: "u2",
    name: "Kheira TA",
    email: "kheira.ta@gmail.com",
    password: "testers2",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ user: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new httpError("Invalid input passed", 422);
  }
  const { name, email, password } = req.body;
  if (DUMMY_USERS.find((u) => (u.email === email))) {
    throw new httpError("Email already registered", 422);
  }
  const newUser = {
    id: uuid(),
    name: name,
    email: email,
    password: password,
  };

  DUMMY_USERS.push(newUser);

  res.status(201).json({ user: newUser });
};

const login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new httpError("Invalid input passed", 422);
  }

  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new httpError("Wrong credentials", 401);
  }
  res.json({ message: "You are logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
