import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveTabId, selectInjectForTab } from "../redux/selectors";
import { activateForTab, deactivateForTab } from "../redux/slice";

const Main = () => {
  const activeTabId = useSelector(selectActiveTabId)!;
  const injectForActiveTab = useSelector(selectInjectForTab(activeTabId));
  const dispatch = useDispatch();
  const onClick = () => {
    if (injectForActiveTab) {
      dispatch(deactivateForTab(activeTabId));
    } else {
      dispatch(activateForTab(activeTabId));
    }
  };
  return (
    <div>
      main view
      <div>
        <button onClick={onClick}>
          {injectForActiveTab ? "deactivate" : "activate"}
        </button>
      </div>
    </div>
  );
};

export default Main;
