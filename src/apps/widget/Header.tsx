import React from "react";

const Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`flex justify-center font-semibold mb-4 text-xl ${className}`}
  >
    {children}
  </div>
);

export default Header;
