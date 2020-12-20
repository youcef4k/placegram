const httpError = require("../models/http-error");

const Place = require("../models/place");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = httpError(
      "Something went wrong, could not find the place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new httpError("Could not find places by id", 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesbyUserId = async (req, res, next) => {
  const userId = req.params.uid;
  //let places;
  let user;
  try {
    // places = await Place.find({ creator: userId });
    user = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new httpError(
      "Something went wrong, cannot find places by User",
      500
    );
    return next(error);
  }
  //if (!places || places.length === 0) {
  if (!user || user.places.length === 0) {
    return next(new httpError("Could not find places by user id", 404));
  }

  res.json({
    places: user.places.map((place) => place.toObject({ getters: true })),
  });
};

const addPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new httpError("Invalid input passed", 422));
  }
  const { title, description, image, coordinates, address, creator } = req.body;
  const newPlace = new Place({
    title: title,
    description: description,
    image: image,
    location: coordinates,
    address: address,
    creator: creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new httpError(
      "Creating place failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new httpError("Could not find the creator id.", 500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPlace.save({ session: sess });
    user.places.push(newPlace);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    const error = new httpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: newPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new httpError("Invalid input passed", 422);
  }
  const placeId = req.params.pid;
  const { title, description } = req.body;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new httpError(
      "Something went wrong, Could not find the place by id",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new httpError(
      "Something went wrong, Could not update the place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new httpError(
      "Something went wrong, cannot find place to delete",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new httpError("Could not find the place by id", 500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({session: sess});
    place.creator.places.pull(place)
    await place.creator.save({session: sess});
    sess.commitTransaction();
  } catch (err) {
    const error = new httpError(
      "Something went wrong, cannot remove the place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "sucessfully deleted!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.addPlace = addPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
