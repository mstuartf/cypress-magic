import React, { ButtonHTMLAttributes } from "react";
import { useDispatch } from "react-redux";
import Button from "./Button";
import { stopRecording } from "../redux/slice";

const StopRecordingBtn = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const dispatch = useDispatch();
  return (
    <Button onClick={() => dispatch(stopRecording())} {...props}>
      Finish recording
    </Button>
  );
};

export default StopRecordingBtn;
