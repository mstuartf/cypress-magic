import React from "react";
import { useSelector } from "react-redux";
import { selectFixtures } from "./redux/selectors";
import JSZip from "jszip";

const DownloadFixtures = () => {
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
      className="text-xs cyw-bg-transparent hover:cyw-bg-blue-500 cyw-text-blue-700 cyw-font-semibold hover:cyw-text-white cyw-py-2 cyw-px-4 cyw-border cyw-border-blue-500 hover:cyw-border-transparent cyw-rounded"
    >
      Download fixtures ({fixtures.length})
    </button>
  );
};

export default DownloadFixtures;
