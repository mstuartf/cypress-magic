import initialize from "./initialize";
import { Observer } from "./observers";

const observers: Observer[] = [
  "navigation",
  "storage",
  "requests",
  "user",
  "viewport",
];

const manager = () => {
  let deinit: () => void;
  const start = (clientId: string) => {
    deinit = initialize(clientId, observers, true);
  };
  const stop = () => {
    deinit();
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
