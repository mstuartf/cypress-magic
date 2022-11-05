import initialize from "./initialize";
import { readClientId } from "./globals";
import { Observer } from "./observers";

const observers: Observer[] = [
  "navigation",
  "fetch",
  "storage",
  "user",
  "viewport",
  "xml",
];

const clientId = readClientId();
initialize(clientId, observers);
