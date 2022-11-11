import React from "react";
import "./App.css";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import Login from "./components/Login";
import Record from "./components/Record";
import { useSelector } from "react-redux";
import { selectCacheLoaded } from "./redux/selectors";
import Generate from "./components/Generate";

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
            <Route exact path="/login">
              <Login />
            </Route>
            <Route path="/record">
              <Record />
            </Route>
            <Route path="/generate">
              <Generate />
            </Route>
            <Route path="*">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
