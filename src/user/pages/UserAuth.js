import React, { useState, useContext } from "react";

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
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from '../../shared/components/FormElements/ImageUpload'; 

const UserAuth = () => {
  const auth = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (!isSignup) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
      const formData = new FormData();
      formData.append('email', formState.inputs.email.value)
      formData.append('name', formState.inputs.name.value)
      formData.append('password', formState.inputs.password.value)
      formData.append('image', formState.inputs.image.value)
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/api/users/signup",
          "POST",
          formData,
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  const signupHandler = () => {
    if (isSignup) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        { ...formState.inputs, name: { value: "", isValid: false }, image: {value: null, isValid: false} },
        false
      );
    }
    setIsSignup((prevMode) => !prevMode);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form className="place-form" onSubmit={formSubmitHandler}>
          {isSignup && (
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
          {isSignup && <ImageUpload center id='image' onInput={inputHandler} errorText='Invalid file, only png, jpg, and jpeg files are supported' />}
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
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
            errorText="Password must have at least 6 characters"
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>
        <Button inverse onClick={signupHandler}>
          Switch to {isSignup ? "Login" : "Sign Up"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default UserAuth;
