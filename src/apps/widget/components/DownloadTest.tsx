import React from "react";
import { useSelector } from "react-redux";
import {
  selectEventsSorted,
  selectMockNetworkRequests,
  selectParseOptions,
  selectTestDescribe,
  selectTestShould,
} from "../redux/selectors";
import { parse } from "../parser";
import { toCamelCase } from "../utils";

const template = (
  describe: string,
  should: string,
  steps: string[]
) => `describe('${describe}', () => {
  it('${should}', () => {\n${steps
  .map((text) => `    ${text}`)
  .join("\n")}\n  });
});`;

const DownloadTest = () => {
  const parseOptions = useSelector(selectParseOptions);
  const events = useSelector(selectEventsSorted);
  const testDescribe = useSelector(selectTestDescribe)!;
  const testShould = useSelector(selectTestShould)!;

  const download = () => {
    const steps = events.map((event) => parse(event, parseOptions));
    const content = template(testDescribe, testShould, steps);
    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${toCamelCase(testDescribe)}.cy.js`;
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
