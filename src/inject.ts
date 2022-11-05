import initialize from "./initialize";
import { Observer } from "./observers";

const observers: Observer[] = [
  "history",
  "storage",
  "fetch",
  "user",
  "viewport",
  "xml",
  "cookies",
];

const manager = () => {
  let deinit: () => string;
  const start = (clientId: string) => {
    deinit = initialize(clientId, observers, true);
  };
  const stop = () => {
    const sessionId = deinit();
    window.postMessage(
      {
        type: "save_session",
        payload: { sessionId },
      },
      "*"
    );
  };
  return { start, stop };
};
const { start, stop } = manager();

window.addEventListener("message", function ({ data }) {
  if (!data) {
    return;
  }
  const { type, payload } = data;
  if (type === "start_recording") {
    start(payload.clientId);
  } else if (type === "stop_recording") {
    stop();
  }
});
