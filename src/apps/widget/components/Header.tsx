import React from "react";

const Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`cyw-flex cyw-justify-center cyw-font-semibold cyw-mb-4 cyw-text-xl ${className}`}
  >
    {children}
  </div>
);

export default Header;
