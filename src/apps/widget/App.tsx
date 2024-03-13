import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEvents, selectIsActive } from "../../redux/selectors";
import { ParsedEvent } from "../../plugin/types";
import { saveEvent } from "../../redux/slice";
import initialize from "../../plugin/initialize";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  const isActive = useSelector(selectIsActive);
  const events = useSelector(selectEvents);
  const [nbEvents, setNbEvents] = useState<number>(0);

  const saveEventCallback = (event: ParsedEvent) => {
    dispatch(saveEvent(event));
  };

  useEffect(() => {
    initialize({
      saveEvent: saveEventCallback,
      saveFixture: () => {},
      buildAlias: () => "abc123",
      registerOnCloseCallback: () => {},
    });
  }, []);

  useEffect(() => {
    if (events.length) {
      for (let i = 0; i < events.length - nbEvents; i++) {
        toast(
          <>
            <div>{events[nbEvents + i].type}</div>
            <div>+ {Math.max(nbEvents + i - 1, 0)} more</div>
          </>,
          {
            toastId: `event-${nbEvents + i}`,
          }
        );
        if (nbEvents + i >= 3) {
          toast.dismiss(`event-${nbEvents + i - 3}`);
        }
      }
      setNbEvents(events.length);
    }
  }, [events]);

  if (!isActive) {
    return null;
  }
  return (
    <div className="">
      <ToastContainer
        stacked={true}
        position="bottom-right"
        autoClose={false}
        closeButton={false}
      />
    </div>
  );
}

export default App;
