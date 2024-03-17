import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTabId } from "../redux/selectors";
import { activateForTab, deactivateForTab } from "../redux/slice";
import { getActiveTabId } from "../../../chrome/utils";

const Main = () => {
  const tabId = useSelector(selectTabId);
  const dispatch = useDispatch();
  const onClick = () => {
    if (!!tabId) {
      dispatch(deactivateForTab());
    } else {
      getActiveTabId().then((value) => dispatch(activateForTab(value)));
    }
  };
  return (
    <div>
      main view {tabId}
      <div>
        <button onClick={onClick}>{!!tabId ? "deactivate" : "activate"}</button>
      </div>
    </div>
  );
};

export default Main;
