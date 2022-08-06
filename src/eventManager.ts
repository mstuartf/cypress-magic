// Stores all events and handles pushing them to the server

export const createEventManager = () => {
  const events: any[] = [];

  const saveEvent = (event: any) => {
    events.push(event);
    // todo: push to the server in real time?
  };

  const getEvents = () => events;

  return {
    saveEvent,
    getEvents,
  };
};
