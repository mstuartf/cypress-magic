import React, { ButtonHTMLAttributes } from "react";

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className={`${
      props.disabled ? "opacity-60" : ""
    } inline-block px-7 py-3 bg-blue-600 text-white font-medium leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out`}
  />
);

export default Button;
