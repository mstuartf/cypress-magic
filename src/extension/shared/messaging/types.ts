type ScriptType = "background" | "content" | "inject" | "popup";

export type ChromeMsgListener = (
  msg: Msg,
  sendResponse: (msg: Msg) => void
) => boolean;
export type ChromeMsgArgs<T = any, R = any> = [
  Msg<T>,
  (response: Msg<R>) => void
];

export type MsgListener = (msg: Msg) => any;
export interface Msg<T = any> {
  type: string;
  meta: {
    from: ScriptType;
    to: ScriptType;
  };
  payload: T;
}
