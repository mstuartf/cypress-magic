import {initializeUserEvents} from "./userEvents";
import {initialiseRequests} from "./requests";
import {initializeNav} from "./navigation";

// todo setViewport
// todo navigate
// todo onunload

const initialize = () => {
  initializeUserEvents();
  initialiseRequests();
  initializeNav();
}

initialize();
