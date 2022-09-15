declare module "storage-changed" {
  export default function fn(storage: "local" | "session"): void;
}

declare module "diff-dom" {
  export var DiffDOM: {
    new (): { diff(a: Node, b: Node): object[] };
  };
}
