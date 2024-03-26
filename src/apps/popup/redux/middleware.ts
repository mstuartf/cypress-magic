import * as redux from "redux";

export const deactivateMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    next(action);
  };
