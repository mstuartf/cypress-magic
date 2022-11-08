import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { selectEmailAddress, selectIsLoggedIn } from "../redux/selectors";
import { logout } from "../redux/slice";

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
