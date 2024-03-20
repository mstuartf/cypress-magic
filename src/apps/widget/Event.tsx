import Typewriter from "./Typewriter";
import { ReactComponent as Refresh } from "../../zondicons/refresh.svg";
import { ReactComponent as Trash } from "../../zondicons/trash.svg";
import { useSelector } from "react-redux";
import { selectEvent } from "./redux/selectors";

const Event = ({ id }: { id: string }) => {
  const event = useSelector(selectEvent(id));
  return (
    <div
      key={event.timestamp}
      className="cyw-mb-2 cyw-text-wrap cyw-break-all cyw-flex cyw-group"
    >
      <p className="cyw-text-xs cyw-flex-grow">
        <Typewriter event={event} />
      </p>
      <div className="cyw-invisible group-hover:cyw-visible cyw-flex cyw-items-center cyw-transition-all ml-1">
        <button className="h-4 w-4">
          <Refresh />
        </button>
      </div>
      <div className="cyw-invisible group-hover:cyw-visible cyw-flex cyw-items-center cyw-transition-all ml-1">
        <button className="h-4 w-4">
          <Trash />
        </button>
      </div>
    </div>
  );
};

export default Event;
