import React from "react";
import { useSelector } from "react-redux";
import {
  selectEventsSorted,
  selectMockNetworkRequests,
} from "./redux/selectors";
import { parse } from "./parser";

const template = (
  describe: string,
  beforeEach: string,
  should: string,
  steps: string[]
) => `describe('${describe}', () => {
  beforeEach(() => {\n    ${beforeEach}\n  })

  it('${should}', () => {\n${steps
  .map((text) => `    ${text}`)
  .join("\n")}\n  });
});`;

const DownloadTest = () => {
  const mockNetworkRequests = useSelector(selectMockNetworkRequests);
  const events = useSelector(selectEventsSorted);

  const download = () => {
    const steps = events.map((event) => parse(event, { mockNetworkRequests }));
    const content = template("my test...", "cy.reload()", "should pass", steps);
    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "test.cy.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={download}
      className="cyw-text-xs cyw-bg-blue-500 hover:cyw-bg-blue-700 cyw-text-white cyw-font-bold cyw-py-2 cyw-px-2 cyw-rounded"
    >
      Download test
    </button>
  );
};

export default DownloadTest;
