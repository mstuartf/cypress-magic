// This script is injected into the MAIN process by the background script.
// It does not have access to the Chrome extension APIs.
import initialize from "../plugin/initialize";
import {
  saveFixture,
  startRecording,
  stopRecording,
  saveEvent,
  updateAliases,
} from "../redux/slice";
import { Fixture, OnCloseCallback, ParsedEvent } from "../plugin/types";
import { AliasTracker, buildAliasTracker } from "../plugin/utils/aliases";

const saveEventFn = (event: ParsedEvent) => {
  window.postMessage({ type: saveEvent.type, payload: event });
};

const saveFixtureFn = (name: string, value: Fixture) => {
  window.postMessage({ type: saveFixture.type, payload: { name, value } });
};

const saveAliasFn = (aliases: AliasTracker) => {
  window.postMessage({
    type: updateAliases.type,
    payload: { aliases: JSON.stringify(aliases) },
  });
};

const onCloseCallbacks: OnCloseCallback[] = [];
const registerOnCloseCallback = (fn: OnCloseCallback) => {
  onCloseCallbacks.push(fn);
};

const init = () => {
  window.addEventListener("message", (event) => {
    if (!event.data || !event.data.type) {
      return;
    }
    if (event.data.type === startRecording.type) {
      const { aliases } = event.data.payload;
      initialize({
        saveEvent: saveEventFn,
        saveFixture: saveFixtureFn,
        registerOnCloseCallback,
        buildAlias: buildAliasTracker(aliases, saveAliasFn),
      });
    }
    if (event.data.type === stopRecording.type) {
      onCloseCallbacks.forEach((fn) => fn());
    }
  });
};

// don't accidentally listen to events inside the chrome extension
const { protocol } = new URL(window.location.href);
if (protocol !== "chrome-extension:") {
  init();
}

export {};
