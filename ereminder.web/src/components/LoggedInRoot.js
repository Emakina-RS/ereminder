import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getInitialData } from "../actions";

// TODO: This whole thing could probably be smarter.
const LoggedInRoot = () => {
  const settings = useSelector(state => state.settings);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getInitialData());
  }, []);
  if (settings === "I have data.") {
    return <Redirect to="/calendar" />;
  }
  if (settings === "No data.") {
    return <Redirect to="/notifications-date" />;
  }
  return <div>Loading...</div>;
};

export default LoggedInRoot;
