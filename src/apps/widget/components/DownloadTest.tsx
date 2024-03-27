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
      className="cyw-text-xs cyw-font-semibold cyw-py-2 cyw-px-2 cyw-flex cyw-items-center cyw-justify-center"
    >
      <span>
        <svg
          height="1em"
          width="1em"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ minWidth: "16px", minHeight: "16px" }}
        >
          <path
            d="M2 14V2C2 1.44772 2.44772 1 3 1H13C13.5523 1 14 1.44772 14 2V14C14 14.5523 13.5523 15 13 15H3C2.44772 15 2 14.5523 2 14Z"
            fill="#2E3247"
          ></path>
          <path
            d="M5 8H8M5 5H11M5 11H10M13 1L3 1C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V2C14 1.44772 13.5523 1 13 1Z"
            stroke="#434861"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </span>
      <span className="cyw-ml-1">Download test</span>
    </button>
  );
};

export default DownloadTest;
