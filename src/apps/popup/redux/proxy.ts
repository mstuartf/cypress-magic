import { applyMiddleware, Store } from "webext-redux";
import * as redux from "redux";
import { deactivateMiddleware } from "./middleware";

const proxyStore = new Store();

const middleware: redux.Middleware[] = [deactivateMiddleware];

const withMiddleware = applyMiddleware(proxyStore, ...middleware);

export default withMiddleware;
