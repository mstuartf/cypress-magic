import { useSelector } from "react-redux";
import { selectEvents } from "./redux/selectors";
import Typewriter from "./Typewriter";

const EventList = () => {
  const events = useSelector(selectEvents);
  return (
    <div className="flex-grow my-4 border border-gray-400 rounded p-2 overflow-scroll">
      {events.map((event) => (
        <div key={event.timestamp} className="mb-1 text-wrap break-words">
          <p className="text-xs">
            <Typewriter event={event} />
          </p>
        </div>
      ))}
    </div>
  );
};

export default EventList;
