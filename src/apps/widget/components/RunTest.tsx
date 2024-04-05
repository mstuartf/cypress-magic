import React from "react";
import { useDispatch } from "react-redux";
import { setIsRunning } from "../redux/slice";

const RunTest = () => {
  const dispatch = useDispatch();
  return (
    <>
      <button onClick={() => dispatch(setIsRunning(true))} className="">
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
      </button>
    </>
  );
};

export default RunTest;
