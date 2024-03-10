import React from "react";
import { useSelector } from "react-redux";
import { selectIsActive } from "../../redux/selectors";

function App() {
  const isActive = useSelector(selectIsActive);
  if (!isActive) {
    return null;
  }
  return (
    <button className="relative inline-flex items-center justify-center p-0.5 mb-16 mr-16 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
      <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        🐞 Report bug
      </span>
    </button>
  );
}

export default App;
