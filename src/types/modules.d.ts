declare module "storage-changed" {
  export default function fn(storage: "local" | "session"): void;
}

declare module "diff-dom" {
  export interface TextNode {
    nodeName: "#text";
    data: string;
  }
  export interface ElementNode {
    nodeName: string;
    attributes?: { [attr: string]: string };
    childNodes?: Array<ElementNode | TextNode>;
    value?: string;
  }
  export type AnyNode = TextNode | ElementNode;

  export interface ModifyAttributeAction {
    action: "modifyAttribute";
    route: number[];
    name: string;
    oldValue: string;
    newValue: string;
  }

  export interface AddAttributeAction {
    action: "addAttribute";
    route: number[];
    name: string;
    value: string;
  }

  export interface ReplaceElementAction {
    action: "replaceElement";
    oldValue: ElementNode | TextNode;
    newValue: ElementNode | TextNode;
    route: number[];
  }

  export interface AddElementAction {
    action: "addElement";
    route: number[];
    element: ElementNode | TextNode;
  }

  export type DiffAction =
    | ModifyAttributeAction
    | AddAttributeAction
    | ReplaceElementAction
    | AddElementAction;

  export var DiffDOM: {
    new (): { diff(a: Node, b: Node): DiffAction[] };
  };
}
