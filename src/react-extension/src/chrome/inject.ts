window.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) {
    return;
  }
  console.log("data:");
  console.log(event.data);
});

console.log("loaded");

export {};
