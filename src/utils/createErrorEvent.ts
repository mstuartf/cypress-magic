import { ErrorEvent } from "../types";

export const createErrorEvent = (
  handler: string,
  { message }: { message: string }
): ErrorEvent => ({
  type: "error",
  timestamp: Date.now(),
  handler,
  message,
});
