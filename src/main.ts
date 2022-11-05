import initialize from "./initialize";
import { readClientId } from "./globals";
import { Observer } from "./observers";

const observers: Observer[] = [
  "history",
  "fetch",
  "localStorage",
  "user",
  "viewport",
  "xml",
];

const clientId = readClientId();
initialize(clientId, observers);
