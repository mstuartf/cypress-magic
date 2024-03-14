import { applyMiddleware, Store } from "webext-redux";
import * as redux from "redux";
import { msgMiddleware } from "./middleware";

const proxyStore = new Store();

const middleware: redux.Middleware[] = [msgMiddleware];

const withMiddleware = applyMiddleware(proxyStore, ...middleware);

export default withMiddleware;
