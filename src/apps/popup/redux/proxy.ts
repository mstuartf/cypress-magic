import { applyMiddleware, Store } from "webext-redux";
import * as redux from "redux";

const proxyStore = new Store();

const middleware: redux.Middleware[] = [];

const withMiddleware = applyMiddleware(proxyStore, ...middleware);

export default withMiddleware;
