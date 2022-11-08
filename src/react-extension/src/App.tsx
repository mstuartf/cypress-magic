import React from "react";
import "./App.css";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import Login from "./components/Login";
import Record from "./components/Record";

const history = createMemoryHistory();

function App() {
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
