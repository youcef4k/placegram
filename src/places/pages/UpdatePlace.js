import React from "react";
import { useParams } from "react-router-dom";

import './PlaceForm.css';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

const PLACES = [
  {
    id: "p1",
    title: "Eiffel Tower",
    description: "The main point of interest in France",
    imageUrl:
      "https://news.cgtn.com/news/2020-06-25/Live-Paris-Eiffel-Tower-reopens-to-public-RBwqXmNekU/img/db13af7526d741b7a4f10475b2f25796/db13af7526d741b7a4f10475b2f25796.jpeg",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    imageUrl:
      "https://www.history.com/.image/t_share/MTU3ODc3NjU2NzUxNTgwODk1/this-day-in-history-05011931---empire-state-building-dedicated.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;

  const identifiedPlace = PLACES.find((p) => p.id === placeId);
  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find the place!</h2>
      </div>
    );
  }

  return (
    <form className='place-form'>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="please enter a valid Title."
        onInput={() => {}}
        value={identifiedPlace.title}
        valid={true}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="please enter a valid description with 5 characters."
        onInput={() => {}}
        value={identifiedPlace.description}
        valid={true}
      />
      <Button type='submit' disabled={true}>UPDATE PLACE</Button>
    </form>
  );

  return <h2>Update Place</h2>;
};

export default UpdatePlace;
