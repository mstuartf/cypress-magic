declare module "storage-changed" {
  function fn(storage: "local" | "session"): void;
  export default fn;
}
