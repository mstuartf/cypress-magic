import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectFixtures } from "../redux/selectors";
import JSZip from "jszip";
import Link from "./Link";

const Fixtures = () => {
  const fixtures = useSelector(selectFixtures);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const zip = new JSZip();
    Object.entries(fixtures).forEach(([path, value]) => {
      zip.file(path, JSON.stringify(value));
    });
    zip.generateAsync({ type: "base64" }).then((content) => {
      setDownloadUrl(`data:application/zip;base64,${content}`);
    });
  }, []);

  return (
    <>
      {downloadUrl ? (
        <Link href={downloadUrl} download>
          Download fixtures
        </Link>
      ) : null}
    </>
  );
};

export default Fixtures;
