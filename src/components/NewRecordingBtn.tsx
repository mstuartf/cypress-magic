import React, { ButtonHTMLAttributes } from "react";
import { startRecording } from "../redux/slice";
import PrimaryButton from "./PrimaryButton";
import { useDispatch } from "react-redux";

const NewRecordingBtn = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const dispatch = useDispatch();
  return (
    <PrimaryButton onClick={() => dispatch(startRecording())} {...props}>
      New recording
    </PrimaryButton>
  );
};

export default NewRecordingBtn;
