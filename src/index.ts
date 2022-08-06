// Initializes the lib to start listening for events and (temporarily) adds the download button the page.

import { initializeUserEvents } from "./userEvents";
import { initialiseRequests } from "./requests";
import { initializeNav } from "./navigation";
import { initializeViewport } from "./viewport";
import { createRegister } from "./client";

const createDownloadBtn = (output: () => any) => {
  const btn = document.createElement("button");
  btn.innerText = "download file";
  btn.style.position = "absolute";
  btn.style.top = "0px";
  btn.style.left = "0px";
  btn.onclick = () => {
    const content = output();
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(content)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "output.json";
    a.click();
  };
  document.body.appendChild(btn);
};

const initialize = () => {
  const { register, output } = createRegister();
  initializeUserEvents(register);
  initialiseRequests(register);
  initializeNav(register);
  initializeViewport(register);
  createDownloadBtn(output);
};

// needs to be in onload or body is null
window.onload = initialize;
