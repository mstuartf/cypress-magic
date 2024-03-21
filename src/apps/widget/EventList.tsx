import { useSelector } from "react-redux";
import {
  selectEventIdsSorted,
  selectTestDescribe,
  selectTestShould,
} from "./redux/selectors";
import { useEffect, useRef, useState } from "react";
import Event from "./Event";
import Line from "../Line";

const EventList = () => {
  const eventIds = useSelector(selectEventIdsSorted);
  const testDescribe = useSelector(selectTestDescribe);
  const testShould = useSelector(selectTestShould);
  const ref = useScrollDownOnSizeIncrease();
  return (
    <div
      ref={ref}
      className="cyw-flex-grow cyw-border cyw-border-gray-400 cyw-rounded cyw-p-2 cyw-overflow-scroll"
    >
      <Line>{`describe('${testDescribe}', () => {`}</Line>
      <Line indent={1}>{`it('${testShould}', () => {`}</Line>
      {eventIds.map((id) => (
        <Event id={id} key={id} />
      ))}
      <Line indent={1}>{`});`}</Line>
      <Line>{`});`}</Line>
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
