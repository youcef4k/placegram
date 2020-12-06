import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import "./UserAuth.css";
import { AuthContext } from "../../shared/context/auth-context";

const UserAuth = () => {
    const auth = useContext(AuthContext);
  const [switchState, setSwitchState] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const formSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    auth.login(); 
  };

  const switchHandler = () => {
    if (switchState) {
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        { ...formState.inputs, name: { value: "", isValid: false } },
        false
      );
    }
    setSwitchState((prevMode) => !prevMode);
  };

  return (
    <Card className="authentication">
      <h2>Login Required</h2>
      <hr />
      <form className="place-form" onSubmit={formSubmitHandler}>
        {switchState && (
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            errorText="Please enter a valid name"
          ></Input>
        )}
        <Input
          id="email"
          element="input"
          type="email"
          label="Email"
          validators={[VALIDATOR_EMAIL()]}
          onInput={inputHandler}
          errorText="Please enter a valid email"
        ></Input>
        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(8)]}
          onInput={inputHandler}
          errorText="Password must have at least 8 characters"
        ></Input>
        <Button disabled={!formState.isValid}>
          {switchState ? "Sign Up" : "Login"}
        </Button>
        <Button inverse onClick={switchHandler}>
          Switch to {switchState ? "Login" : "Sign Up"}
        </Button>
      </form>
    </Card>
  );
};

export default UserAuth;
