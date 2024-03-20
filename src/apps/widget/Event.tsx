import Typewriter from "./Typewriter";
import { ReactComponent as Refresh } from "../../zondicons/refresh.svg";
import { ReactComponent as Trash } from "../../zondicons/trash.svg";
import { useDispatch, useSelector } from "react-redux";
import { selectEvent, selectMockNetworkRequests } from "./redux/selectors";
import { deleteEvent, updateEvent } from "./redux/slice";
import { isUserEvent } from "./utils";
import { parseSelectorPositionOnly } from "./parser/parseSelector";
import { getTargetProps } from "../../plugin/observers/user";
import { isHTMLElement } from "./hooks/useNewFixedElementAdded";
import { parse } from "./parser";
import { useEffect, useState } from "react";

const Event = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const event = useSelector(selectEvent(id));
  const updateEventTarget = () => {
    if (isUserEvent(event)) {
      const targetEl = document.querySelector(
        parseSelectorPositionOnly(event.target.domPath)
      );
      if (targetEl && isHTMLElement(targetEl)) {
        dispatch(
          updateEvent({
            ...event,
            ...getTargetProps(targetEl),
          })
        );
      }
    }
  };
  const mockNetworkRequests = useSelector(selectMockNetworkRequests);
  const [text, setText] = useState("");
  useEffect(() => {
    const updated = parse(event, { mockNetworkRequests });
    if (text !== updated) {
      setText(updated);
    }
  }, [mockNetworkRequests, event]);
  return (
    <div
      key={event.timestamp}
      className="cyw-mb-2 cyw-text-wrap cyw-break-all cyw-flex cyw-group"
    >
      <p className="cyw-text-xs cyw-flex-grow">
        <Typewriter text={text} />
      </p>
      {isUserEvent(event) && (
        <div className="cyw-invisible group-hover:cyw-visible cyw-flex cyw-items-center cyw-transition-all ml-1">
          <button onClick={updateEventTarget} className="h-4 w-4">
            <Refresh />
          </button>
        </div>
      )}
      <div className="cyw-invisible group-hover:cyw-visible cyw-flex cyw-items-center cyw-transition-all ml-1">
        <button className="h-4 w-4" onClick={() => dispatch(deleteEvent(id))}>
          <Trash />
        </button>
      </div>
    </div>
  );
};

export default Event;
