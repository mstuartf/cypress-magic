import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import { useSelector } from "react-redux";
import { selectCacheLoaded } from "./redux/selectors";
import Main from "./components/Main";

const history = createMemoryHistory();

function App() {
  const cacheLoaded = useSelector(selectCacheLoaded);
  if (!cacheLoaded) {
    return <>Loading...</>;
  }

  return (
    <div className="w-full h-full px-8 py-6">
      <div className="h-full w-full">
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
