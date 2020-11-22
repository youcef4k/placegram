import React from "react";
import {useParams} from 'react-router-dom';

import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
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

  const userId = useParams().userId;
  const loadedPlaces = PLACES.filter((place)=> place.creator === userId);

  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
