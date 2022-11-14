import React, { ButtonHTMLAttributes } from "react";
import Button from "./Button";

const PrimaryButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Button
    {...props}
    className="bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800"
  />
);

export default PrimaryButton;
