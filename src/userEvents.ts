import {EventType, ParsedEvent} from "./types";
import {finder} from '@medv/finder';

function parseEvent(event: Event): ParsedEvent {
    let selector: string;
    const target = event.target as Element;
    // todo: support multiple selectors (nested array?)
    if (target.hasAttribute('data-cy')) {
        selector = `[data-cy=${target.getAttribute('data-cy')}]`;
    } else {
        selector = finder(target);
    }
    const parsedEvent: ParsedEvent = {
        timestamp: Date.now(),
        selector,
        type: event.type,
        tag: target.tagName,
        value: (event.target as HTMLInputElement).value,
        classList: target.classList,
    };
    if ((target as HTMLAnchorElement).hasAttribute('href')) {
        parsedEvent.href = (target as HTMLAnchorElement).href
    }
    if (target.hasAttribute('id')) {
        parsedEvent.id = target.id
    }
    if (parsedEvent.tag === 'INPUT') {
        parsedEvent.inputType = (target as HTMLInputElement).type;
    }
    // todo: should be keyDown or keyUp
    if (event.type === 'keydown') {
        parsedEvent.key = (event as KeyboardEvent).key;
    }
    // todo: add offsetX and offsetY for click events
    parsedEvent.innerText = (target as HTMLDivElement).innerText;
    return parsedEvent;
}

function handleEvent(event: Event, register: (event: any) => void): void {
    if (event.isTrusted === true) {
        register(parseEvent(event));
    }
}

function addDOMListeners(register: (event: any) => void): void {
    Object.values(EventType).forEach(event => {
        document.addEventListener(event, (event) => handleEvent(event, register), {
            capture: true,
            passive: true,
        });
    });
}

export function initializeUserEvents(register: (event: any) => void): void {
    addDOMListeners(register);
}

