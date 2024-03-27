import React from "react";
import { useSelector } from "react-redux";
import {
  selectFixtures,
  selectMockNetworkRequests,
  selectTestDescribe,
} from "../redux/selectors";
import JSZip from "jszip";
import { toCamelCase } from "../utils";
import { unPickleBlob } from "../../../plugin/utils/pickleBlob";

const DownloadFixtures = () => {
  const fixtures = useSelector(selectFixtures);
  const mockNetworkRequests = useSelector(selectMockNetworkRequests);
  const testDescribe = useSelector(selectTestDescribe)!;
  const disabled = !mockNetworkRequests || !fixtures.length;
  const download = () => {
    const zip = new JSZip();
    const folder = zip.folder(toCamelCase(testDescribe));
    Promise.all(
      fixtures.map(([name, pickle]) =>
        unPickleBlob(pickle).then((blob) => ({ name, blob }))
      )
    ).then((results) => {
      results.forEach(({ name, blob }) => {
        folder!.file(name, blob);
      });
      zip.generateAsync({ type: "blob" }).then((zipBlob) => {
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${toCamelCase(testDescribe)}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    });
  };
  return (
    <button
      onClick={download}
      disabled={disabled}
      className={`cyw-text-xs cyw-font-semibold cyw-py-2 cyw-px-2 cyw-flex cyw-items-center cyw-justify-center ${
        !disabled ? "" : "cyw-cursor-not-allowed"
      }`}
    >
      <span>
        <svg
          height="1em"
          width="1em"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ minWidth: "16px", minHeight: "16px" }}
        >
          <path
            d="M14 13C14.5523 13 15 12.5523 15 12V4C15 3.44772 14.5523 3 14 3H9L7.29289 4.70711C7.10536 4.89464 6.851 5 6.58579 5H1V12C1 12.5523 1.44772 13 2 13H14Z"
            fill="#2E3247"
          ></path>
          <path
            d="M9 3L7.29289 1.29289C7.10536 1.10536 6.851 1 6.58579 1H2C1.44772 1 1 1.44772 1 2V5M9 3H14C14.5523 3 15 3.44772 15 4V12C15 12.5523 14.5523 13 14 13H2C1.44772 13 1 12.5523 1 12V5M9 3L7.29289 4.70711C7.10536 4.89464 6.851 5 6.58579 5H1"
            stroke="#434861"
            strokeWidth="2"
            strokeLinejoin="round"
          ></path>
        </svg>
      </span>
      <span className="cyw-ml-1">
        Download fixtures{mockNetworkRequests && <> ({fixtures.length})</>}
      </span>
    </button>
  );
};

export default DownloadFixtures;
