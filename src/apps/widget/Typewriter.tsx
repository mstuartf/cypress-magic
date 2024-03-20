import { useEffect, useState } from "react";

const Typewriter = ({ text }: { text: string }) => {
  const [partialText, setPartialText] = useState("");

  useEffect(() => {
    setPartialText("");
  }, [text]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (text.length > partialText.length) {
        setPartialText(text.slice(0, partialText.length + 1));
      }
    }, 10);
    return () => clearInterval(interval);
  }, [partialText]);

  return <>{partialText}</>;
};

export default Typewriter;
