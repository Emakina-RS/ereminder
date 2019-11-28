import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { getConfiguration } from "../actions";

// TODO: This whole thing could probably be smarter.
const LoggedInRoot = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getConfiguration());
  }, [dispatch]);

  return <Redirect to="/calendar" />;
};

export default LoggedInRoot;
