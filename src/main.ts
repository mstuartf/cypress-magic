import initialize from "./initialize";
import { readClientId } from "./globals";
import { Observer } from "./observers";

const observers: Observer[] = [
  "navigation",
  "requests",
  "storage",
  "user",
  "viewport",
];

const clientId = readClientId();
initialize(clientId, observers);
