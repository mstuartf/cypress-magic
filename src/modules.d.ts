declare module "storage-changed" {
  export default function fn(storage: "local" | "session"): void;
}
