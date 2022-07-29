export interface ParsedEvent {
    selector: string;
    type: string;
    tag: string;
    value: string;
    id?: string;
    key?: string;
    href?: string;
    inputType?: string;
    innerText?: string;
    timestamp: number;
    classList: DOMTokenList;
}

export enum EventType {
    CLICK = 'click',
    CHANGE = 'change',
    DBLCLICK = 'dblclick',
    KEYDOWN = 'keydown',
    SUBMIT = 'submit',
}
