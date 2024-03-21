import React from "react";
import { useSelector } from "react-redux";
import { selectEventsSorted } from "./redux/selectors";

const DownloadTest = () => {
  const events = useSelector(selectEventsSorted);
  const download = () => {
    const content = `
describe('My Cypress Test', () => {
  it('should do something', () => {
    // Your test code here
  });
});
`;
    // Create a Blob object from the content
    const blob = new Blob([content], { type: "text/javascript" });

    // Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = "test.cy.js";

    // Append the link to the body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up: remove the link and revoke the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <button
      onClick={download}
      className="text-xs cyw-bg-blue-500 hover:cyw-bg-blue-700 cyw-text-white cyw-font-bold cyw-py-2 cyw-px-4 cyw-rounded"
    >
      Download test
    </button>
  );
};

export default DownloadTest;
