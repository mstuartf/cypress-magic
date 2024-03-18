import { useSelector } from "react-redux";
import { selectEvents } from "./redux/selectors";
import Typewriter from "./Typewriter";

const EventList = () => {
  const events = useSelector(selectEvents);
  return (
    <div className="cyw-flex-grow cyw-my-4 cyw-border cyw-border-gray-400 cyw-rounded cyw-p-2 cyw-overflow-scroll">
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
