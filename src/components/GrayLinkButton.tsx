import React, { ButtonHTMLAttributes } from "react";

const GrayLinkButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="text-gray-400 hover:text-gray-500 transition duration-300 ease-in-out"
  />
);

export default GrayLinkButton;
