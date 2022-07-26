export interface ParsedEvent {
    selector: string,
    action: string,
    tag: string,
    value: string,
    id?: string,
    key?: string,
    href?: string,
    inputType?: string,
}

export enum EventType {
    CLICK = 'click',
    CHANGE = 'change',
    DBLCLICK = 'dblclick',
    KEYDOWN = 'keydown',
    SUBMIT = 'submit',
}
