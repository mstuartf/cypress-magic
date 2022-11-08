// This script is injected into the MAIN process by the background script.
// It does not have access to the Chrome extension APIs.
import { Observer } from "../../../observers";
import initialize from "../../../initialize";

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

const manager = () => {
  let deInit: () => string;
  const start = (clientId: string) => {
    deInit = initialize(clientId, observers, true);
  };
  const stop = () => {
    const sessionId = deInit();
    console.log(`stop: ${sessionId}`);
  };
  return { start, stop };
};
const { start, stop } = manager();

window.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) {
    return;
  }
  if (event.data.type === "user/startRecording") {
    console.log(event.data.type, event.data.payload);
  }
  if (event.data.type === "user/stopRecording") {
    console.log(event.data.type, event.data.payload);
  }
});

export {};
