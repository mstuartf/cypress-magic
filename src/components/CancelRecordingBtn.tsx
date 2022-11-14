import React, { ButtonHTMLAttributes } from "react";
import { cancelRecording } from "../redux/slice";
import SecondaryButton from "./SecondaryButton";
import { useDispatch } from "react-redux";

const CancelRecordingBtn = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const dispatch = useDispatch();
  return (
    <SecondaryButton onClick={() => dispatch(cancelRecording())} {...props}>
      Cancel
    </SecondaryButton>
  );
};

export default CancelRecordingBtn;
