import _, { DebouncedFunc } from "lodash";

import type { StateFunc } from "./state";

export class Log {
  createSnapshot: Function;
  state: StateFunc;
  config: any;
  fireChangeEvent: DebouncedFunc<(log) => void | undefined>;

  _hasInitiallyLogged: boolean = false;
  private attributes: Record<string, any> = {};
  private _emittedAttrs: Record<string, any> = {};

  constructor(createSnapshot, state, config, fireChangeEvent) {
    this.createSnapshot = createSnapshot;
    this.state = state;
    this.config = config;
    // only fire the log:state:changed event as fast as every 4ms
    this.fireChangeEvent = _.debounce(fireChangeEvent, 4);
  }

  get(attr) {}
  unset(key) {}
  invoke(key) {}
  toJSON() {}
  set(key, val?) {}
  pick(...args) {}
  snapshot(name?, options: any = {}) {
    return this;
  }
  error(err) {}
  end() {}
  endGroup() {}
  getError(err) {}
  setElAttrs() {}
  merge(log) {}
  _shouldAutoEnd() {}
  finish() {}
  wrapConsoleProps() {}
  wrapRenderProps() {}
}
