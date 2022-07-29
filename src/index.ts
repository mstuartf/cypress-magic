import {initializeUserEvents} from "./userEvents";
import {initialiseRequests} from "./requests";
import {initializeNav} from "./navigation";
import {initializeViewport} from "./viewport";
import {createRegister} from "./client";

// todo onunload?

const initialize = () => {
    const register = createRegister();
    initializeUserEvents(register);
    initialiseRequests(register);
    initializeNav(register);
    initializeViewport(register);
}

initialize();
