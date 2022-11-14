// This script is injected into the MAIN process by the background script.
// It does not have access to the Chrome extension APIs.
import initialize from "../plugin/initialize";
import { Observer } from "../plugin/observers";
import {
  saveSession,
  startRecording,
  stopRecording,
  saveFixture,
} from "../redux/slice";
import { SaveFixture } from "../plugin/types";

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

const sendFixtureToSave: SaveFixture = (name, value) => {
  window.postMessage({ type: saveFixture.type, payload: { name, value } });
};

window.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) {
    return;
  }
  if (event.data.type === startRecording.type) {
    const { client_id } = event.data.payload;
    deInit = initialize(client_id, observers, sendFixtureToSave, true);
  }
  if (event.data.type === stopRecording.type) {
    const session_id = deInit();
    window.postMessage({ type: saveSession.type, payload: { session_id } });
  }
});

export {};
