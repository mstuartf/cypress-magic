import { useSelector } from "react-redux";
import { selectEvents } from "./redux/selectors";
import Typewriter from "./Typewriter";
import { useEffect, useRef, useState } from "react";

const EventList = () => {
  const events = useSelector(selectEvents);
  const ref = useScrollDownOnSizeIncrease();
  return (
    <div
      ref={ref}
      className="cyw-flex-grow cyw-my-4 cyw-border cyw-border-gray-400 cyw-rounded cyw-p-2 cyw-overflow-scroll"
    >
      {events.map((event) => (
        <div
          key={event.timestamp}
          className="cyw-mb-1 cyw-text-wrap cyw-break-words"
        >
          <p className="cyw-text-xs">
            <Typewriter event={event} />
          </p>
        </div>
      ))}
    </div>
  );
};

export default EventList;

export const useScrollDownOnSizeIncrease = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(() => {
        const newScrollHeight = ref.current?.scrollHeight || 0;
        if (!!ref.current && newScrollHeight > scrollHeight) {
          ref.current.scrollTop = ref.current.scrollHeight;
        }
        setScrollHeight(ref.current?.scrollHeight || 0);
      });
      observer.observe(ref.current, {
        characterData: true,
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  }, [ref]);

  return ref;
};
