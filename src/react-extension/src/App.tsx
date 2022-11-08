import React, { useEffect } from "react";
import "./App.css";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import Login from "./components/Login";
import Record from "./components/Record";
import { useDispatch, useSelector } from "react-redux";
import { selectCacheLoaded } from "./redux/selectors";
import { loadCache } from "./redux/slice";

const history = createMemoryHistory();

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadCache());
  }, []);

  const cacheLoaded = useSelector(selectCacheLoaded);
  if (!cacheLoaded) {
    return <>Loading...</>;
  }

  return (
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route path="/record">
            <Record />
          </Route>
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
