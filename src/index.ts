import * as _ from 'lodash';
import {initializeUserEvents, logEvents} from "./userEvents";
import {initialiseRequests} from "./requests";

initializeUserEvents();
initialiseRequests();

function component() {
  const element = document.createElement('button');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.onclick = logEvents;

  return element;
}

document.body.appendChild(component());


export const makeRequest = () => {
  return fetch('https://swapi.dev/api/people/1')
}

export const periodicRequests = () => {
  setTimeout(makeRequest, 1000);
  setTimeout(makeRequest, 2000);
  setTimeout(makeRequest, 5000);
}

periodicRequests();
