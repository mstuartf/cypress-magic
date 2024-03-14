import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ParsedEvent, UserEvent } from "../../plugin/types";
import { saveEvent } from "./redux/slice";
import initialize from "../../plugin/initialize";
import Resizer from "./Resizer";
import EventList from "./EventList";
import { widgetId } from "./constants";

function App() {
  const dispatch = useDispatch();

  const saveEventCallback = (event: ParsedEvent) => {
    if ((event as UserEvent).target?.domPath) {
      const inWidget = (event as UserEvent).target?.domPath.find(
        ({ id }) => id === widgetId
      );
      if (inWidget) {
        return;
      }
    }
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

  return (
    <Resizer>
      <EventList />
    </Resizer>
  );
}

export default App;
