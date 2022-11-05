import initialize from "./initialize";
import { readClientId } from "./globals";
import { Observer } from "./observers";

const observers: Observer[] = [
  "history",
  "fetch",
  "localStorage",
  "sessionStorage",
  "user",
  "viewport",
  "xml",
  "cookies",
];

const clientId = readClientId();
initialize(clientId, observers);
