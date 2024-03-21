import React, { useState } from "react";
import Header from "./Header";
import {
  setupTest,
  setHasRefreshed,
  setRecordingInProgress,
} from "./redux/slice";
import { useDispatch } from "react-redux";
import InputRow from "./InputRow";

const Setup = () => {
  const dispatch = useDispatch();
  const [baseUrl, setBaseUrl] = useState<string | undefined>();
  const [testDescribe, setTestDescribe] = useState("");
  const [testShould, setTestShould] = useState("");
  const disabled = !testShould || !testDescribe;

  const startRecording = () => {
    dispatch(
      setupTest({
        baseUrl,
        testDescribe,
        testShould,
      })
    );
    dispatch(setHasRefreshed(false));
    dispatch(setRecordingInProgress(true));
    window.location.reload();
  };

  return (
    <div className="cyw-grid">
      <Header>Welcome</Header>
      <InputRow
        value={testDescribe}
        placeholder="e.g. User login"
        info="Short title for the test that appears in the 'describe' block."
        setValue={setTestDescribe}
        label="Title"
      />
      <InputRow
        value={testShould}
        placeholder="e.g. should redirect to homepage"
        info="Summary of the behaviour the test covers that appears in the 'it' block."
        setValue={setTestShould}
        label="Assertion"
      />
      <InputRow
        value={baseUrl}
        placeholder="e.g. https://api.placeholder.com"
        info="Only API calls made to URLS starting with this value will be matched and intercepted (optional)."
        setValue={setBaseUrl}
        label="Match API calls to"
      />
      <button
        onClick={startRecording}
        className={`cyw-text-xs cyw-font-bold cyw-py-2 cyw-px-4 cyw-rounded ${
          !disabled
            ? "cyw-bg-blue-500 hover:cyw-bg-blue-700 cyw-text-white "
            : "cyw-bg-gray-100 cyw-text-gray-500 cyw-border-gray-500 cyw-cursor-not-allowed"
        }`}
      >
        Start recording
      </button>
    </div>
  );
};

export default Setup;
