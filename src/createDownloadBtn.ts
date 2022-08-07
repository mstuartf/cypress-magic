// (temporarily) adds the download button to the page.

import { ParsedEvent } from "./types";

export const createDownloadBtn = (getEvents: () => ParsedEvent[]) => {
  const btn = document.createElement("button");
  btn.innerText = "download file";
  btn.style.position = "absolute";
  btn.style.top = "0px";
  btn.style.left = "0px";
  btn.onclick = () => {
    const content = {
      title: "all events",
      steps: getEvents(),
    };
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(content)], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "output.json";
    a.click();
  };
  document.body.appendChild(btn);
};
