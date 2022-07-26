import * as _ from 'lodash';
import {EventType, ParsedEvent} from "./types";
import {finder} from '@medv/finder';
import {periodicRequests} from "./requests";
import {register} from 'fetch-intercept';

const EVENTS: ParsedEvent[] = [];

function parseEvent(event: Event): ParsedEvent {
  let selector: string;
  if ((event.target as Element).hasAttribute('data-cy')) {
    selector = `[data-cy=${(event.target as Element).getAttribute('data-cy')}]`;
  } else if ((event.target as Element).hasAttribute('data-test')) {
    selector = `[data-test=${(event.target as Element).getAttribute('data-test')}]`;
  } else if ((event.target as Element).hasAttribute('data-testid')) {
    selector = `[data-testid=${(event.target as Element).getAttribute('data-testid')}]`;
  } else {
    selector = finder(event.target as Element, { attr: (name, value) => name === 'data-cy' || name === 'data-test' || name === 'data-testid' });
  }
  const parsedEvent: ParsedEvent = {
    selector,
    action: event.type,
    tag: (event.target as Element).tagName,
    value: (event.target as HTMLInputElement).value,
  };
  if ((event.target as HTMLAnchorElement).hasAttribute('href')) parsedEvent.href = (event.target as HTMLAnchorElement).href;
  if ((event.target as Element).hasAttribute('id')) parsedEvent.id = (event.target as Element).id;
  if (parsedEvent.tag === 'INPUT') parsedEvent.inputType = (event.target as HTMLInputElement).type;
  if (event.type === 'keydown') parsedEvent.key = (event as KeyboardEvent).key;
  return parsedEvent;
}

/**
 * Checks if DOM event was triggered by user; if so, it calls parseEvent on the data.
 * @param event
 */
function handleEvent(event: Event): void {
  if (event.isTrusted === true) {
    try {
      EVENTS.push(parseEvent(event));
    } catch (error) {
      throw new Error(error as any);
    }
  }
}

/**
 * Adds event listeners to the DOM.
 */
function addDOMListeners(): void {
  Object.values(EventType).forEach(event => {
    document.addEventListener(event, handleEvent, {
      capture: true,
      passive: true,
    });
  });
}

/**
 * Removes event listeners from the DOM.
 */
function removeDOMListeners(): void {
  Object.values(EventType).forEach(event => {
    document.removeEventListener(event, handleEvent, { capture: true });
  });
}

/**
 * Initializes the event recorder.
 */
function initialize(): void {
  addDOMListeners();
}

initialize();

const logEvents = () => console.log('events', EVENTS);


function component() {
  const element = document.createElement('button');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.onclick = logEvents;

  return element;
}

document.body.appendChild(component());

register({
  request: function (url, config) {
    // Modify the url or config here
    console.log(url);
    return [url, config];
  },

  requestError: function (error) {
    // Called when an error occured during another 'request' interceptor call
    return Promise.reject(error);
  },

  response: function (response) {
    // Modify the reponse object
    console.log(response);
    return response;
  },

  responseError: function (error) {
    // Handle an fetch error
    return Promise.reject(error);
  }
});


periodicRequests()
