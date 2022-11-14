import React, { ButtonHTMLAttributes } from "react";
import { useDispatch } from "react-redux";
import PrimaryButton from "./PrimaryButton";
import { stopRecording } from "../redux/slice";

const StopRecordingBtn = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const dispatch = useDispatch();
  return (
    <PrimaryButton onClick={() => dispatch(stopRecording())} {...props}>
      Finish recording
    </PrimaryButton>
  );
};

export default StopRecordingBtn;
