import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Youcef SB",
      image:
        "https://i1.sndcdn.com/avatars-000167754175-zo48js-t500x500.jpg",
      places: 3,
    },
    {
        id: "u2",
        name: "Max Shwartz",
        image:
          "https://stevensducks.com/images/2012/11/13//_RJF7500.jpg",
        places: 8,
      },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
