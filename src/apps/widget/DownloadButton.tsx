import React from "react";
import { useSelector } from "react-redux";
import { selectFixtures } from "./redux/selectors";
import JSZip from "jszip";

const DownloadButton = () => {
  const fixtures = useSelector(selectFixtures);
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
      link.download = "files.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };
  return (
    <button
      onClick={download}
      className="text-xs cyw-bg-blue-500 hover:cyw-bg-blue-700 cyw-text-white cyw-font-bold cyw-py-2 cyw-px-4 cyw-rounded"
    >
      Download test and fixtures!
    </button>
  );
};

export default DownloadButton;
