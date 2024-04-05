import React from "react";
import { useSelector } from "react-redux";
import {
  selectIsAddingCommands,
  selectIsRunning,
  selectRunError,
} from "../redux/selectors";

const Bordered = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  const runError = useSelector(selectRunError);
  const isRunning = useSelector(selectIsRunning);
  const isAddingCommands = useSelector(selectIsAddingCommands);

  let borderClass: string;
  if (isRunning) {
    borderClass = "cyw-border-gray-900";
  } else if (runError) {
    borderClass = "cyw-border-red-300";
  } else if (isAddingCommands) {
    borderClass = "cyw-border-purple-500";
  } else {
    borderClass = "cyw-border-emerald-500";
  }
  return (
    <div className={`${className} cyw-border-l-4 ${borderClass}`}>
      {children}
    </div>
  );
};

export default Bordered;
