import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecordingInProgress } from "../redux/slice";
import {
  selectHasRefreshed,
  selectIsRunning,
  selectTestDescribe,
} from "../redux/selectors";
import Header from "./Header";
import AddAssertion from "./AddAssertion";
import EventList from "./EventList";
import Toggle from "./Toggle";
import ToggleMocks from "./ToggleMocks";
import DownloadFixtures from "./DownloadFixtures";
import DownloadTest from "./DownloadTest";
import RunTest from "./RunTest";
import { toCamelCase } from "../utils";

const RecordingInProgress = () => {
  const dispatch = useDispatch();
  const hasRefreshed = useSelector(selectHasRefreshed);
  const testDescribe = useSelector(selectTestDescribe)!;
  const onCancel = () => {
    dispatch(setRecordingInProgress(false));
  };
  return (
    <div className="cyw-h-full cyw-flex cyw-flex-col">
      <div className="cyw-flex cyw-items-center cyw-justify-between cyw-mb-4 cyw-border-b cyw-border-slate-400 cyw-pb-4">
        <div className="cyw-text-sm">
          <span className="cyw-text-slate-100 cyw-font-semibold">
            {toCamelCase(testDescribe)}
          </span>
          <span>.cy.js</span>
        </div>
        <div className="cyw-grid cyw-grid-cols-3 cyw-border cyw-border-slate-400 cyw-rounded">
          <div className="cyw-p-0.5 cyw-border-r cyw-border-slate-400 cyw-flex cyw-items-center cyw-justify-center">
            <button onClick={onCancel} className="">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3.70711 2.29289C3.31658 1.90237 2.68342 1.90237 2.29289 2.29289C1.90237 2.68342 1.90237 3.31658 2.29289 3.70711L3.70711 2.29289ZM8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L8.29289 9.70711ZM9.70711 3.70711C10.0976 3.31658 10.0976 2.68342 9.70711 2.29289C9.31658 1.90237 8.68342 1.90237 8.29289 2.29289L9.70711 3.70711ZM2.29289 8.29289C1.90237 8.68342 1.90237 9.31658 2.29289 9.70711C2.68342 10.0976 3.31658 10.0976 3.70711 9.70711L2.29289 8.29289ZM2.29289 3.70711L8.29289 9.70711L9.70711 8.29289L3.70711 2.29289L2.29289 3.70711ZM8.29289 2.29289L2.29289 8.29289L3.70711 9.70711L9.70711 3.70711L8.29289 2.29289Z"
                  fill="#E45770"
                  className="icon-dark"
                ></path>
              </svg>
            </button>
          </div>
          <div className="cyw-p-0.5 cyw-border-r cyw-border-slate-400">
            <AddAssertion />
          </div>
          <div className="cyw-p-0.5">
            <RunTest />
          </div>
        </div>
      </div>
      {hasRefreshed && (
        <>
          <ToggleMocks />
          <div className="cyw-h-4" />
          <EventList />
          <div className="cyw-grid cyw-grid-cols-2 cyw-mt-4 cyw-pt-4 cyw-border-t cyw-border-slate-400">
            <DownloadFixtures />
            <DownloadTest />
          </div>
        </>
      )}
    </div>
  );
};

export default RecordingInProgress;
