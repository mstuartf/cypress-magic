import React, { useState } from "react";
import Header from "./Header";
import { setBaseUrl, setRecordingInProgress } from "./redux/slice";
import { useDispatch } from "react-redux";

const Setup = () => {
  const dispatch = useDispatch();
  const [url, setUrl] = useState<string | undefined>();

  const startRecording = () => {
    dispatch(setBaseUrl(url));
    dispatch(setRecordingInProgress(true));
    window.location.reload();
  };

  return (
    <div className="grid">
      <Header>Welcome</Header>
      <div className="w-full mb-6">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor="grid-first-name"
        >
          Match API calls to:
        </label>
        <input
          value={url}
          onChange={({ target: { value } }) => setUrl(value)}
          className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          id="grid-first-name"
          type="text"
          placeholder="e.g. https://api.placeholder.com"
        />
        <p className="text-gray-600 text-xs italic">
          Only API calls made to URLS starting with this value will be matched
          and intercepted.
        </p>
      </div>
      <button
        onClick={startRecording}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start recording
      </button>
    </div>
  );
};

export default Setup;
