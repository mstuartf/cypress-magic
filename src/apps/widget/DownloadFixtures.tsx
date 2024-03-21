import React from "react";
import { useSelector } from "react-redux";
import { selectFixtures, selectMockNetworkRequests } from "./redux/selectors";
import JSZip from "jszip";

const DownloadFixtures = () => {
  const fixtures = useSelector(selectFixtures);
  const mockNetworkRequests = useSelector(selectMockNetworkRequests);
  const disabled = !mockNetworkRequests || !fixtures.length;
  const download = () => {
    const zip = new JSZip();
    const folder = zip.folder("fixtures");
    fixtures.forEach(([name, blob]) => {
      folder!.file(name, blob);
    });
    zip.generateAsync({ type: "blob" }).then((zipBlob) => {
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "fixtures.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };
  return (
    <button
      onClick={download}
      disabled={disabled}
      className={`disabled:cyw-cursor-not-allowed cyw-text-xs cyw-font-semibold cyw-py-2 cyw-px-2 cyw-border cyw-rounded ${
        !disabled
          ? "cyw-bg-transparent cyw-text-blue-700 cyw-border-blue-500 hover:cyw-text-white hover:cyw-bg-blue-500 hover:cyw-border-transparent"
          : "cyw-bg-gray-100 cyw-text-gray-500 cyw-border-gray-500"
      }`}
    >
      Download fixtures{!disabled && <> ({fixtures.length})</>}
    </button>
  );
};

export default DownloadFixtures;
