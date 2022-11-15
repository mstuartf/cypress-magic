import React, { useState } from "react";
import Header from "../Header";
import PrimaryButton from "../PrimaryButton";
import { logout, setDownloadUrl, setTestName } from "../../redux/slice";
import GrayLinkButton from "../GrayLinkButton";
import { generateTestFileRequest } from "../../requests";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDownloadUrl,
  selectEmailAddress,
  selectFixtures,
  selectSessionId,
  selectTestName,
  selectToken,
} from "../../redux/selectors";
import Input from "../Input";
import JSZip from "jszip";
import Link from "../Link";
import Spinner from "../Spinner";
import { Redirect } from "react-router-dom";
import NewRecordingBtn from "../NewRecordingBtn";
import CancelRecordingBtn from "../CancelRecordingBtn";
import { unPickleFixtures } from "../../plugin/utils/pickleBlob";

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
    generateTestFileRequest(sessionId!, kebabName, token!)
      .then(({ mocked, fixtures: finalFixtureNames }) => {
        dispatch(setTestName(kebabName));
        const zip = new JSZip();
        zip.file(`${kebabName}-mocked.cy.js`, mocked);
        const finalFixtures = Object.entries(fixtures).filter(
          ([path, pickle]) => finalFixtureNames.includes(path)
        );
        unPickleFixtures(finalFixtures).then((values) => {
          values.forEach(({ name: path, blob }) => {
            zip.file(`${kebabName}_fixtures/${path}`, blob);
          });
          zip.generateAsync({ type: "base64" }).then((content) => {
            dispatch(setDownloadUrl(`data:application/zip;base64,${content}`));
          });
        });
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
          <div className="w-full">
            <label className="block text-gray-700 font-semibold mb-2">
              Generate test files
            </label>
            <Input
              placeholder="Enter test name (e.g. login)"
              disabled={isGenerating}
              value={localTestName}
              onChange={({ target: { value } }) => setLocalTestName(value)}
            />
          </div>
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
      {!downloadUrl ? (
        <div className="grid grid-cols-2 gap-4 w-full">
          <CancelRecordingBtn />
          <PrimaryButton
            disabled={!localTestName && !testName}
            onClick={generateTestAssets}
          >
            Generate
          </PrimaryButton>
        </div>
      ) : (
        <div className="flex justify-center">
          <NewRecordingBtn disabled={!localTestName && !testName} />
        </div>
      )}
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
