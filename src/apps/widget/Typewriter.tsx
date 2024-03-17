import { useEffect, useState } from "react";
import { ParsedEvent } from "../../plugin/types";
import { parse } from "./parser";

const Typewriter = ({ event }: { event: ParsedEvent }) => {
  const [partialText, setPartialText] = useState("");

  useEffect(() => {
    const finalText = parse(event);
    const interval = setInterval(() => {
      if (finalText.length > partialText.length) {
        setPartialText(finalText.slice(0, partialText.length + 1));
      }
    }, 10);
    return () => clearInterval(interval);
  }, [event, partialText]);

  return <>{partialText}</>;
};

export default Typewriter;
