import { ErrorEvent } from "../types";
import { generateEventId } from "./generateEventId";

export const createErrorEvent = (
  handler: string,
  { message }: { message: string }
): ErrorEvent => ({
  id: generateEventId(),
  type: "error",
  timestamp: Date.now(),
  handler,
  message,
});
