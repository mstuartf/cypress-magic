import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelTest } from "../redux/slice";
import {
  selectHasRefreshed,
  selectIsRunning,
  selectTestDescribe,
} from "../redux/selectors";
import EventList from "./EventList";
import ToggleMocks from "./ToggleMocks";
import DownloadFixtures from "./DownloadFixtures";
import DownloadTest from "./DownloadTest";
import { toCamelCase } from "../utils";
import FileIcon from "./FileIcon";
import Cross from "./Cross";
import TestRunner from "./TestRunner";

const SetupComplete = () => {
  const dispatch = useDispatch();
  const hasRefreshed = useSelector(selectHasRefreshed);
  const testDescribe = useSelector(selectTestDescribe)!;
  const isRunning = useSelector(selectIsRunning);
  const onCancel = () => dispatch(cancelTest());
  return (
    <div className="cyw-h-full cyw-flex cyw-flex-col">
      <div className="cyw-mb-4 cyw-border-b cyw-border-slate-400 cyw-pb-4">
        <div className="cyw-flex cyw-items-center cyw-justify-between cyw-mb-2">
          <div className="cyw-text-sm cyw-flex cyw-items-center">
            <span>
              <FileIcon />
            </span>
            <span className="cyw-text-slate-100 cyw-font-semibold cyw-ml-1">
              {toCamelCase(testDescribe)}
            </span>
            <span>.cy.js</span>
          </div>
          <button onClick={onCancel} className="">
            <Cross />
          </button>
        </div>
        <ToggleMocks />
      </div>
      {isRunning && <TestRunner />}
      {hasRefreshed && (
        <>
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

export default SetupComplete;
