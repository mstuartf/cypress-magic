declare module "storage-changed" {
  function fn(storage: Storage, options?: { eventName: string }): void;
  export default fn;
}
