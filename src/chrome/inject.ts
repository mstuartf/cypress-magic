// This script is injected into the MAIN process by the background script.
// It does not have access to the Chrome extension APIs.
import initialize from "../plugin/initialize";
import { Observer } from "../plugin/observers";

const observers: Observer[] = [
  "history",
  "localStorage",
  "sessionStorage",
  "fetch",
  "user",
  "viewport",
  "xml",
  "cookies",
];

let deInit: () => string;

window.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) {
    return;
  }
  if (event.data.type === "user/startRecording") {
    const { client_id } = event.data.payload;
    deInit = initialize(client_id, observers, true);
  }
  if (event.data.type === "user/stopRecording") {
    const session_id = deInit();
    window.postMessage({ type: "user/saveSession", payload: { session_id } });
  }
});

export {};
