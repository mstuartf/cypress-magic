import React, { AnchorHTMLAttributes } from "react";

const Link = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    {...props}
    className="text-blue-400 hover:text-blue-500 transition duration-300 ease-in-out"
  />
);

export default Link;
