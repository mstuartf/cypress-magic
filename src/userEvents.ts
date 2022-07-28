import {EventType, ParsedEvent} from "./types";
import {finder} from '@medv/finder';

function parseEvent(event: Event): ParsedEvent {
    let selector: string;
    if ((event.target as Element).hasAttribute('data-cy')) {
        selector = `[data-cy=${(event.target as Element).getAttribute('data-cy')}]`;
    } else if ((event.target as Element).hasAttribute('data-test')) {
        selector = `[data-test=${(event.target as Element).getAttribute('data-test')}]`;
    } else if ((event.target as Element).hasAttribute('data-testid')) {
        selector = `[data-testid=${(event.target as Element).getAttribute('data-testid')}]`;
    } else {
        // todo: select by containing text
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

