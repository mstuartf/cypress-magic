import { ReactComponent as Trash } from "../../../zondicons/trash.svg";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteEvent } from "../redux/slice";
import { Tooltip } from "react-tooltip";

const DeleteEvent = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  return (
    <>
      <button
        data-tooltip-id="delete-event-tooltip"
        data-tooltip-content="Delete event"
        className="cyw-h-4 cyw-w-4 cyw-text-white"
        onClick={() => dispatch(deleteEvent(id))}
      >
        <Trash fill="#94a3b8" width={12} />
      </button>
      <Tooltip id="delete-event-tooltip" className="cyw-text-xs" />
    </>
  );
};

export default DeleteEvent;
