import React from "react";
import Icon from "./Icon";

const Header = () => (
  <div className="text-lg font-semibold text-gray-700 text-center flex items-center mb-4">
    <div className="h-6 w-6 flex items-center justify-center">
      <Icon />
    </div>
    <div className="ml-2">Seasmoke</div>
  </div>
);

export default Header;
