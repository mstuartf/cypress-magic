import React, { useState } from "react";
import { setHasRefreshed, setupTest, startNewTest } from "../redux/slice";
import { useDispatch } from "react-redux";
import InputRow from "./InputRow";
import FileIcon from "./FileIcon";
import TextAreaRow from "./TextAreaRow";

const Setup = () => {
  const dispatch = useDispatch();
  const [baseUrl, setBaseUrl] = useState<string | undefined>();
  const [beforeEach, setBeforeEach] = useState<string | undefined>();
  const [testDescribe, setTestDescribe] = useState("");
  const [testShould, setTestShould] = useState("");
  const disabled = !testShould || !testDescribe;

  const startRecording = () => {
    dispatch(
      setupTest({
        baseUrl,
        testDescribe,
        testShould,
        testBeforeEach: beforeEach,
      })
    );
    dispatch(setHasRefreshed(false));
    dispatch(startNewTest());
    window.location.reload();
  };

  return (
    <div className="cyw-grid">
      <div className="cyw-text-slate-100 cyw-font-semibold cyw-mb-4 cyw-flex cyw-justify-center cyw-items-center">
        <FileIcon />
        <span className="cyw-ml-2">Create a new test</span>
      </div>
      <InputRow
        value={testDescribe}
        placeholder="e.g. User login"
        info="Short title for the test that appears in the 'describe' block."
        setValue={setTestDescribe}
        label="Title"
        required
      />
      <InputRow
        value={testShould}
        placeholder="e.g. should redirect to homepage"
        info="Summary of the behaviour the test covers that appears in the 'it' block."
        setValue={setTestShould}
        label="Assertion"
        required
      />
      <InputRow
        value={baseUrl}
        placeholder="e.g. https://api.placeholder.com"
        info="Only API calls made to URLs starting with this value will be matched and intercepted."
        setValue={setBaseUrl}
        label="Match API calls to"
      />
      <TextAreaRow
        value={beforeEach}
        placeholder="e.g. authentication logic"
        info="Any code here will be executed in a beforeEach hook."
        setValue={setBeforeEach}
        label="Before Each"
      />
      <button
        onClick={startRecording}
        className={`cyw-text-xs cyw-font-bold cyw-py-2 cyw-px-4 cyw-rounded cyw-mb-6 ${
          !disabled
            ? "cyw-bg-emerald-300 hover:cyw-bg-bg-emerald-400 cyw-text-gray-900"
            : "cyw-bg-gray-100 cyw-text-gray-500 cyw-border-gray-500 cyw-cursor-not-allowed"
        }`}
      >
        Start recording
      </button>
      <p className="cyw-text-xs cyw-italic">
        This will create a new test file that starts with a cy.visit to the
        current URL. You can then interact with the app to add further commands.
      </p>
    </div>
  );
};

export default Setup;
