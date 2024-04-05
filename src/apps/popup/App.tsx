import React, { useEffect } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveTabId, selectCacheLoaded } from "./redux/selectors";
import Main from "./components/Main";
import { setActiveTabId } from "./redux/slice";
import { sideBarWidth } from "../widget/constants";

const history = createMemoryHistory();

function App() {
  const dispatch = useDispatch();
  const cacheLoaded = useSelector(selectCacheLoaded);
  const activeTabId = useSelector(selectActiveTabId);

  useEffect(() => {
    // Better to set the active tab ID when opening the popup rather than on focus changes in case
    // the bg script is dormant and the user refocuses the window and opens the popup before interacting
    // with the tab (in which case the tab activated event will not fire).
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      dispatch(setActiveTabId(tabs[0].id!));
    });
  }, []);

  if (!cacheLoaded || !activeTabId) {
    return <>Loading...</>;
  }

  return (
    <div className="cyw-bg-transparent cyw-w-96">
      <div className="cyw-border cyw-border-gray-100 cyw-w-full">
        <Router history={history}>
          <Switch>
            <Route path="/record">
              <Main />
            </Route>
            <Route path="*">
              <Redirect to="/record" />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
