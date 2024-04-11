import type { KeyboardModifiers } from "../cy/keyboard";

export interface StateFunc {
  (k: "keyboardModifiers", v?: KeyboardModifiers): KeyboardModifiers;
}
