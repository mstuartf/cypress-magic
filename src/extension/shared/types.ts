type ScriptType = "background" | "content" | "inject" | "popup";

export type MsgListener = (msg: Msg) => any;
export interface Msg<T = any> {
  type: string;
  meta: {
    from: ScriptType;
    to: ScriptType;
  };
  payload?: T;
}
