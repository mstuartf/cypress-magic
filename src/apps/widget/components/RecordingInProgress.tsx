import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRecordingInProgress } from "../redux/slice";
import {
  selectHasRefreshed,
  selectTestDescribe,
  selectTestShould,
} from "../redux/selectors";
import AddAssertion from "./AddAssertion";
import EventList from "./EventList";
import ToggleMocks from "./ToggleMocks";
import DownloadFixtures from "./DownloadFixtures";
import DownloadTest from "./DownloadTest";
import RunTest from "./RunTest";
import { toCamelCase } from "../utils";
import FileIcon from "./FileIcon";
import Cross from "./Cross";

const RecordingInProgress = () => {
  const dispatch = useDispatch();
  const hasRefreshed = useSelector(selectHasRefreshed);
  const testDescribe = useSelector(selectTestDescribe)!;
  const onCancel = () => {
    dispatch(setRecordingInProgress(false));
  };
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
          <div className="cyw-grid cyw-grid-cols-3 cyw-border cyw-border-slate-400 cyw-rounded">
            <div className="cyw-p-0.5 cyw-border-r cyw-border-slate-400 cyw-flex cyw-items-center cyw-justify-center">
              <button onClick={onCancel} className="">
                <Cross />
              </button>
            </div>
            <div className="cyw-p-0.5 cyw-border-r cyw-border-slate-400 cyw-flex cyw-items-center cyw-justify-center">
              <AddAssertion />
            </div>
            <div className="cyw-p-0.5 cyw-flex cyw-items-center cyw-justify-center">
              <RunTest />
            </div>
          </div>
        </div>
        <ToggleMocks />
      </div>
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

export default RecordingInProgress;
