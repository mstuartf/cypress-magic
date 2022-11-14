import React, { ButtonHTMLAttributes } from "react";
import Button from "./Button";

const SecondaryButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Button
    {...props}
    className="border-2 border-blue-600 text-blue-600 hover:bg-black hover:bg-opacity-5"
  />
);

export default SecondaryButton;
