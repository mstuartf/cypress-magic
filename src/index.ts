import {initializeUserEvents} from "./userEvents";
import {initialiseRequests} from "./requests";
import {initializeNav} from "./navigation";
import {createRegister} from "./client";

// todo setViewport
// todo navigate
// todo onunload

const initialize = () => {

    const register = createRegister();
  initializeUserEvents(register);
  initialiseRequests(register);
  initializeNav(register);
}

initialize();
