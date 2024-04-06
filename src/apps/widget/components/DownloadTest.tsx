import React from "react";
import { useSelector } from "react-redux";
import {
  selectBeforeEach,
  selectEventsSorted,
  selectParseOptions,
  selectTestDescribe,
  selectTestShould,
} from "../redux/selectors";
import { parse } from "../parser";
import { toCamelCase } from "../utils";
import FileIcon from "./FileIcon";
import { Tooltip } from "react-tooltip";

const template = (
  describe: string,
  should: string,
  beforeEach: string | undefined,
  steps: string[]
) => `describe('${describe}', () => {
  ${!!beforeEach ? `beforeEach(() => {\n    ${beforeEach}\n  });` : ""}
  it('${should}', () => {\n${steps
  .map((text) => `    ${text}`)
  .join("\n")}\n  });
});`;

const DownloadTest = () => {
  const parseOptions = useSelector(selectParseOptions);
  const events = useSelector(selectEventsSorted);
  const testDescribe = useSelector(selectTestDescribe)!;
  const testShould = useSelector(selectTestShould)!;
  const beforeEach = useSelector(selectBeforeEach);

  const download = () => {
    const steps = events.map((event) => parse(event, parseOptions));
    const content = template(testDescribe, testShould, beforeEach, steps);
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
    <>
      <button
        data-tooltip-id="download-test-tooltip"
        data-tooltip-content={`Download ${toCamelCase(testDescribe)}.cy.js`}
        onClick={download}
        className="cyw-text-xs cyw-font-semibold cyw-py-2 cyw-px-2 cyw-flex cyw-items-center cyw-justify-center"
      >
        <span>
          <FileIcon />
        </span>
        <span className="cyw-ml-1">Download test file</span>
      </button>
      <Tooltip id="download-test-tooltip" className="cyw-text-xs" />
    </>
  );
};

export default DownloadTest;
