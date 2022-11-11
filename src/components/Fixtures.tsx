import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectFixtures } from "../redux/selectors";
import JSZip from "jszip";
import Link from "./Link";
import { sessionFileRequest } from "../requests";
import Spinner from "./Spinner";

const Fixtures = ({ testFileUrl }: { testFileUrl: string }) => {
  const fixtures = useSelector(selectFixtures);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    sessionFileRequest(testFileUrl).then((res) => {
      const zip = new JSZip();
      zip.file("test.spec.js", res);
      Object.entries(fixtures).forEach(([path, value]) => {
        zip.file(`fixtures/${path}`, JSON.stringify(value));
      });
      zip.generateAsync({ type: "base64" }).then((content) => {
        setDownloadUrl(`data:application/zip;base64,${content}`);
      });
    });
  }, []);

  return (
    <>
      {downloadUrl ? (
        <Link href={downloadUrl} download>
          Download test assets
        </Link>
      ) : (
        <div className="flex items-center">
          <Spinner />
          <div className="ml-4">Zipping...</div>
        </div>
      )}
    </>
  );
};

export default Fixtures;
