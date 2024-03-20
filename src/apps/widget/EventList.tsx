import { useSelector } from "react-redux";
import { selectEventIdsSorted } from "./redux/selectors";
import { useEffect, useRef, useState } from "react";
import Event from "./Event";

const EventList = () => {
  const eventIds = useSelector(selectEventIdsSorted);
  const ref = useScrollDownOnSizeIncrease();
  return (
    <div
      ref={ref}
      className="cyw-flex-grow cyw-my-4 cyw-border cyw-border-gray-400 cyw-rounded cyw-p-2 cyw-overflow-scroll"
    >
      {eventIds.map((id) => (
        <Event id={id} key={id} />
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
