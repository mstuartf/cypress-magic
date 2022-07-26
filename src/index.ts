import {initializeUserEvents} from "./userEvents";
import {initialiseRequests} from "./requests";

initializeUserEvents();
initialiseRequests();

function createButton() {
  const element = document.createElement('button');
  element.innerHTML = "click me"
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
  setTimeout(makeRequest, 2000);
  setTimeout(makeRequest, 5000);
}

createButton();
createInput();
periodicRequests();
