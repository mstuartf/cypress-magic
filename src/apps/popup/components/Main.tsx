import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRecording } from "../../../redux/selectors";
import { startRecording, stopRecording } from "../../../redux/slice";

const Main = () => {
  const isRecording = useSelector(selectIsRecording);
  const dispatch = useDispatch();
  const onClick = () => {
    if (isRecording) {
      dispatch(stopRecording());
    } else {
      dispatch(startRecording());
    }
  };
  return (
    <div>
      main view
      <div>
        <button onClick={onClick}>{isRecording ? "stop" : "start"}</button>
      </div>
    </div>
  );
};

export default Main;
