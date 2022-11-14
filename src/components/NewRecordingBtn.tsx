import React, { ButtonHTMLAttributes } from "react";
import { startRecording } from "../redux/slice";
import Button from "./Button";
import { useDispatch } from "react-redux";

const NewRecordingBtn = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const dispatch = useDispatch();
  return (
    <Button onClick={() => dispatch(startRecording())} {...props}>
      New recording
    </Button>
  );
};

export default NewRecordingBtn;
