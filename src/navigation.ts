function monkeyPatchHistory(history: History, register: (event: any) => void) {
  const baseEvent = {
    type: "urlChange",
    timestamp: Date.now(),
  };

  const pushState = history.pushState;
  history.pushState = function (state, unused, url) {
    register({ ...baseEvent, url });
    return pushState.apply(history, arguments);
  };

  const replaceState = history.replaceState;
  history.replaceState = function (state, unused, url) {
    register({ ...baseEvent, url });
    return replaceState.apply(history, arguments);
  };

  const back = history.back;
  history.back = function () {
    register({
      ...baseEvent,
      url: "back",
    });
    return back.apply(history, arguments);
  };

  const forward = history.forward;
  history.forward = function () {
    register({
      ...baseEvent,
      url: "forward",
    });
    return forward.apply(history, arguments);
  };

  const go = history.go;
  history.go = function (delta) {
    register({
      ...baseEvent,
      delta,
    });
    return go.apply(history, arguments);
  };
}

export const initializeNav = (register: (event: any) => void) => {
  monkeyPatchHistory(window.history, register);
  // this is only required once for the cy.visit at the start of the test
  register({
    type: "navigate",
    url: window.location.href,
  });
};
