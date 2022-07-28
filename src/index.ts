import {initializeUserEvents} from "./userEvents";
import {initialiseRequests} from "./requests";
import {initializeNav} from "./navigation";

initializeUserEvents();
initialiseRequests();
initializeNav();

function updateURL() {
  if (history.pushState) {
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?para=hello';
    window.history.pushState({path:newurl},'',newurl);
  }
}

function createButton() {
  const element = document.createElement('button');
  element.innerHTML = "click me"
  element.onclick = updateURL;
  document.body.appendChild(element);
}

function createInput() {
  const element = document.createElement('input');
  document.body.appendChild(element);
}

export const makeRequest = () => {
  return fetch('https://swapi.dev/api/people/1')
}

export const periodicRequests = () => {
  setTimeout(makeRequest, 1000);
  setTimeout(makeRequest, 5000);
  setTimeout(makeRequest, 9000);
}

createButton();
createInput();
periodicRequests();

// todo setViewport
// todo navigate
// todo onunload
