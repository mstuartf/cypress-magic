import { useEffect, useState } from "react";

const Typewriter = ({
  text,
  disabled,
}: {
  text: string;
  disabled: boolean;
}) => {
  const [partialText, setPartialText] = useState("");

  useEffect(() => {
    if (!disabled && partialText !== text) {
      setPartialText("");
    } else {
      setPartialText(text);
    }
  }, [text, disabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (text.length > partialText.length) {
        setPartialText(text.slice(0, partialText.length + 1));
      }
    }, 10);
    return () => clearInterval(interval);
  }, [partialText, text]);

  return <>{partialText}</>;
};

export default Typewriter;
