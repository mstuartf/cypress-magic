import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  selectEmailAddress,
  selectIsLoggedIn,
} from "../chrome/background";
import { Redirect } from "react-router-dom";

const Record = () => {
  const email = useSelector(selectEmailAddress);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      Record
      <div>{email}</div>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  );
};

export default Record;
