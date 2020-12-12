const httpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most sky scrappers",
    location: {
      lat: 40,
      lng: -73,
    },
    address: "somewhere in the US",
    creator: "u1",
  },
  {
    id: "p2",
    title: "Eiffel Tower",
    description: "One of the most famous",
    location: {
      lat: 50,
      lng: -23,
    },
    address: "somewhere in the France",
    creator: "u2",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // params = {pid: 'p1'}
  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    throw new httpError("Could not find places by id", 404);
  }

  res.json(place);
};

const getPlacesbyUserId = (req, res, next) => {
  const userId = req.params.uid; // params = {uid: 'u1'}
  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places) {
    return next(new httpError("Could not find places by user id", 404));
  }

  res.json(places);
};

const addPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new httpError("Invalid input passed", 422);
  }
  const { title, description, coordinates, address, creator } = req.body;
  const newPlace = {
    id: uuid(),
    title: title,
    description: description,
    location: coordinates,
    address: address,
    creator: creator,
  };

  DUMMY_PLACES.push(newPlace);

  res.status(201).json({ place: newPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new httpError("Invalid input passed", 422);
  }
  const placeId = req.params.pid;
  const { title, description } = req.body;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;
  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json(updatedPlace);
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    throw new httpError("Place does not exist", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "sucessfully deleted!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.addPlace = addPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
