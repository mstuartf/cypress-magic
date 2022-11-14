import React, { ButtonHTMLAttributes } from "react";

const Button = ({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...rest}
    className={`${
      rest.disabled ? "opacity-60" : ""
    } ${className} inline-block px-7 py-3 font-medium leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out`}
  />
);

export default Button;
