// Stores all events and handles pushing them to the server

export const createEventManager = () => {
  const events: any[] = [];

  const saveEvent = (event: any) => {
    events.push(event);
  };

  const getEvents = () => events;

  return {
    saveEvent,
    getEvents,
  };
};
