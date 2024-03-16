import { useSelector } from "react-redux";
import { selectEvents } from "./redux/selectors";
import { useEffect, useState } from "react";
import { ParsedEvent } from "../../plugin/types";
import { getEventId } from "./constants";

const Typewriter = ({ className }: { className?: string }) => {
  const events = useSelector(selectEvents);
  const [draftText, setDraftText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [draftedEvents, setDraftedEvents] = useState<ParsedEvent[]>([]);

  useEffect(() => {
    const newEvents = events.filter(
      (event) =>
        !draftedEvents.find(
          (drafted) => getEventId(event) === getEventId(drafted)
        )
    );
    if (!newEvents.length) return;
    const appendToDraft = newEvents
      .map((event) => `${event.type} at ${event.timestamp}`)
      .join("\n");
    setDraftText(`${draftText}${draftText.length ? "\n" : ""}${appendToDraft}`);
    setDraftedEvents(events);
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (draftText.length > displayText.length) {
        setDisplayText(draftText.slice(0, displayText.length + 1));
      }
    }, 10);
    return () => clearInterval(interval);
  }, [draftText, displayText]);

  // todo: prevent user edits while machine is typing
  // todo: support deletions...

  return (
    <textarea
      className={className}
      value={displayText}
      onChange={({ target: { value } }) => setDraftText(value)}
    />
  );
};

export default Typewriter;
