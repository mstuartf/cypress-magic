import React, { useState } from "react";
import Header from "./Header";
import Button from "./Button";
import {
  logout,
  setDownloadUrl,
  setTestName,
  startRecording,
} from "../redux/slice";
import GrayLinkButton from "./GrayLinkButton";
import { sessionFileRequest, sessionUrlRequest } from "../requests";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDownloadUrl,
  selectEmailAddress,
  selectFixtures,
  selectSessionId,
  selectTestName,
  selectToken,
} from "../redux/selectors";
import Input from "./Input";
import JSZip from "jszip";
import Link from "./Link";
import Spinner from "./Spinner";
import { Redirect } from "react-router-dom";

const kebabCase = (raw: string) =>
  raw
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

const Generate = () => {
  const dispatch = useDispatch();

  const [localTestName, setLocalTestName] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const fixtures = useSelector(selectFixtures);
  const token = useSelector(selectToken);
  const sessionId = useSelector(selectSessionId);
  const emailAddress = useSelector(selectEmailAddress);
  const downloadUrl = useSelector(selectDownloadUrl);
  const testName = useSelector(selectTestName);

  const generateTestAssets = () => {
    const kebabName = kebabCase(localTestName);
    setIsGenerating(true);
    sessionUrlRequest(sessionId!, kebabName, token!)
      .then(({ url }) => {
        // todo: snake case the name
        dispatch(setTestName(kebabName));
        sessionFileRequest(url)
          .then((res) => {
            const zip = new JSZip();
            zip.file(`${kebabName}.spec.js`, res);
            Object.entries(fixtures).forEach(([path, value]) => {
              zip.file(`${kebabName}_fixtures/${path}`, JSON.stringify(value));
            });
            zip.generateAsync({ type: "base64" }).then((content) => {
              dispatch(
                setDownloadUrl(`data:application/zip;base64,${content}`)
              );
            });
          })
          .catch(() => setIsGenerating(false));
      })
      .catch(() => setIsGenerating(false));
  };

  if (!token) {
    return <Redirect to="/login" />;
  }

  if (!sessionId) {
    return <Redirect to="/record" />;
  }

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="h-20 w-full flex items-center justify-center text-gray-700">
        {!downloadUrl && !isGenerating && (
          <Input
            placeholder="Enter test name (e.g. login)"
            disabled={isGenerating}
            value={localTestName}
            onChange={({ target: { value } }) => setLocalTestName(value)}
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
            Download '{testName}' test assets
          </Link>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          disabled={!localTestName && !testName}
          onClick={() => {
            if (!downloadUrl) {
              generateTestAssets();
            } else {
              dispatch(startRecording());
            }
          }}
        >
          {!downloadUrl ? "Generate test assets" : "New recording"}
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
