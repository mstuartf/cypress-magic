import React, { useState } from "react";
import Header from "./Header";
import Button from "./Button";
import { logout } from "../redux/slice";
import GrayLinkButton from "./GrayLinkButton";
import { sessionFileRequest, sessionUrlRequest } from "../requests";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEmailAddress,
  selectFixtures,
  selectSessionId,
  selectSessionUrl,
  selectToken,
} from "../redux/selectors";
import Input from "./Input";
import JSZip from "jszip";
import Link from "./Link";
import Spinner from "./Spinner";
import { Redirect } from "react-router-dom";

const Generate = () => {
  const dispatch = useDispatch();

  const [testName, setTestName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const fixtures = useSelector(selectFixtures);
  const token = useSelector(selectToken);
  const sessionId = useSelector(selectSessionId);
  const emailAddress = useSelector(selectEmailAddress);

  const generateTestAssets = () => {
    setIsGenerating(true);
    sessionUrlRequest(sessionId!, testName, token!)
      .then(({ url }) => {
        sessionFileRequest(url)
          .then((res) => {
            const zip = new JSZip();
            zip.file("test.spec.js", res);
            Object.entries(fixtures).forEach(([path, value]) => {
              zip.file(`fixtures/${path}`, JSON.stringify(value));
            });
            zip.generateAsync({ type: "base64" }).then((content) => {
              setDownloadUrl(`data:application/zip;base64,${content}`);
            });
          })
          .catch(() => setIsGenerating(false));
      })
      .catch(() => setIsGenerating(false));
  };

  if (!token) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="h-20 w-full flex items-center justify-center text-gray-700">
        {!downloadUrl && !isGenerating && (
          <Input
            placeholder="Enter test name (e.g. login)"
            disabled={isGenerating}
            value={testName}
            onChange={({ target: { value } }) => setTestName(value)}
          />
        )}
        {!downloadUrl && isGenerating && (
          <div className="flex items-center">
            <Spinner />
            <div className="ml-4">Generating...</div>
          </div>
        )}
        {!!downloadUrl && (
          <Link href={downloadUrl} download>
            Download test assets
          </Link>
        )}
      </div>
      <div className="flex justify-center">
        <Button disabled={!testName} onClick={generateTestAssets}>
          Generate test assets
        </Button>
      </div>
      <div className="flex flex-grow justify-between items-end text-xs">
        <div className="text-gray-400">{emailAddress}</div>
        <GrayLinkButton onClick={() => dispatch(logout())}>
          Logout
        </GrayLinkButton>
      </div>
    </div>
  );
};

export default Generate;
