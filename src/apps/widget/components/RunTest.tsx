import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRunning } from "../redux/selectors";
import { setIsRunning } from "../redux/slice";
import TestRunner from "./TestRunner";

const RunTest = () => {
  const dispatch = useDispatch();
  const isRunning = useSelector(selectIsRunning);
  return (
    <>
      <button onClick={() => dispatch(setIsRunning(!isRunning))} className="">
        {!isRunning ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8C3 5.23858 5.23858 3 8 3H11M11 3L9 5M11 3L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-light"
            ></path>
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 11.5V4.5C4 4.22386 4.22386 4 4.5 4H11.5C11.7761 4 12 4.22386 12 4.5V11.5C12 11.7761 11.7761 12 11.5 12H4.5C4.22386 12 4 11.7761 4 11.5Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon-light"
            ></path>
          </svg>
        )}
      </button>
      {isRunning && <TestRunner />}
    </>
  );
};

export default RunTest;
