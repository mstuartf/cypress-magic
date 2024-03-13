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
        console.log(`showing event ${events[nbEvents + i].timestamp}`);
        toast(
          <>
            <div>
              {nbEvents + i + 1}. {events[nbEvents + i].type}
            </div>
          </>,
          {
            toastId: events[nbEvents + i].timestamp,
          }
        );
        if (nbEvents + i >= 3) {
          console.log(`removing event ${events[nbEvents + i - 3].timestamp}`);
          toast.dismiss(events[nbEvents + i - 3].timestamp);
        }
      }
      setNbEvents(events.length);
    }
    console.log(events);
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
        closeButton={true}
      />
    </div>
  );
}

export default App;
