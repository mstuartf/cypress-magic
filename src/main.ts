import initialize from "./initialize";
import { readClientId } from "./globals";

const clientId = readClientId();
initialize(clientId);
