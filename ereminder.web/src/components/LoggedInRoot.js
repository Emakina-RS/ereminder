import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getConfiguration } from "../actions";

// TODO: This whole thing could probably be smarter.
const LoggedInRoot = () => {
  const { configuration, configurationReceived } = useSelector(
    state => state.configuration
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getConfiguration());
  }, [dispatch]);
  if (!configurationReceived) {
    return <div>Loading...</div>;
  }
  if (configuration === null) {
    return <Redirect to="/notifications-date" />;
  }
  return <Redirect to="/calendar" />;
};

export default LoggedInRoot;
