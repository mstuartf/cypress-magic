import React from "react";
import { useSelector } from "react-redux";
import {
  selectHasRefreshed,
  selectIsRunning,
  selectMockNetworkRequests,
  selectTestFileName,
} from "../redux/selectors";
import EventList from "./EventList";
import ToggleMocks from "./ToggleMocks";
import DownloadFixtures from "./DownloadFixtures";
import DownloadTest from "./DownloadTest";
import FileIcon from "./FileIcon";
import TestRunner from "./TestRunner";
import CancelTest from "./CancelTest";

const SetupComplete = () => {
  const hasRefreshed = useSelector(selectHasRefreshed);
  const isRunning = useSelector(selectIsRunning);
  const fileName = useSelector(selectTestFileName);
  const mockNetworkRequests = useSelector(selectMockNetworkRequests);
  return (
    <div className="cyw-h-full cyw-flex cyw-flex-col">
      <div className="cyw-mb-4 cyw-border-b cyw-border-slate-400 cyw-pb-4">
        <div className="cyw-flex cyw-items-center cyw-justify-between cyw-mb-2">
          <div className="cyw-text-sm cyw-flex cyw-items-center">
            <span>
              <FileIcon />
            </span>
            <span className="cyw-text-slate-100 cyw-font-semibold cyw-ml-1">
              {fileName}
            </span>
            <span>.cy.js</span>
          </div>
          <CancelTest />
        </div>
        <ToggleMocks />
      </div>
      {isRunning && <TestRunner />}
      {hasRefreshed && (
        <>
          <EventList />
          <div className="cyw-grid cyw-grid-cols-2 cyw-mt-4 cyw-pt-4 cyw-border-t cyw-border-slate-400">
            <div>{mockNetworkRequests && <DownloadFixtures />}</div>
            <div>
              <DownloadTest />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SetupComplete;
