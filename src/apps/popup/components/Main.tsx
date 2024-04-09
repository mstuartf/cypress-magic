import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveTabId,
  selectInjectForTab,
  selectUserInfo,
} from "../redux/selectors";
import { activateForTab, deactivateForTab } from "../redux/slice";

const appName = "Cypress Magic";

const Main = () => {
  const activeTabId = useSelector(selectActiveTabId)!;
  const injectForActiveTab = useSelector(selectInjectForTab(activeTabId));
  const { email } = useSelector(selectUserInfo)!;
  const dispatch = useDispatch();
  const onClick = () => {
    if (injectForActiveTab) {
      dispatch(deactivateForTab(activeTabId));
    } else {
      dispatch(activateForTab(activeTabId));
    }
    window.close();
  };
  return (
    <div className="cyw-flex cyw-flex-col">
      <div className="cyw-flex cyw-flex-col cyw-bg-slate-100 cyw-py-4 cyw-px-8 cyw-items-start cyw-w-full">
        <p className="cyw-font-semibold cyw-text-lg cyw-mb-1">{appName}</p>
        <p>{email}</p>
      </div>
      <div className="cyw-flex cyw-flex-col cyw-bg-white cyw-py-4 cyw-px-8 cyw-pb-8 cyw-items-start cyw-w-full cyw-gap-4">
        <p>
          Inject {appName} into any SPA and start recording. Like Cypress
          Studio, the extension will record&nbsp;
          <strong>click</strong>,&nbsp;
          <strong>type</strong>,&nbsp;
          <strong>check</strong>,&nbsp;
          <strong>uncheck</strong>, and&nbsp;
          <strong>select</strong> interactions with the page. You can also add
          simple assertions.
        </p>
        <p>
          It will also record all network calls made using{" "}
          <strong>fetch</strong> or <strong>XMLHttpRequest</strong> and
          intercept and wait for them in the generated test file. You can also
          download all responses as fixtures if you want to stub API calls in
          your test.
        </p>
        <button
          className="cyw-border cyw-rounded cyw-flex cyw-outline-none cyw-leading-tight cyw-gap-2 cyw-items-center cyw-border-indigo-500 cyw-bg-indigo-500 focus:cyw-bg-indigo-600 cyw-text-white cyw-px-4 cyw-py-2 cyw-text-md"
          onClick={onClick}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              fill="#D0D2E0"
              d="M15 14V5h-3v6H4v3h11Z"
              className="icon-light"
            ></path>
            <path
              fill="currentColor"
              d="M15 5h1a1 1 0 0 0-1-1v1ZM4 14H3a1 1 0 0 0 1 1v-1Zm11 0v1a1 1 0 0 0 1-1h-1ZM1 2V1a1 1 0 0 0-1 1h1Zm11 0h1a1 1 0 0 0-1-1v1ZM1 11H0a1 1 0 0 0 1 1v-1Zm11 0v1a1 1 0 0 0 1-1h-1Zm2-6v9h2V5h-2Zm1 8H4v2h11v-2ZM1 3h11V1H1v2Zm11 7H4v2h8v-2Zm-8 0H1v2h3v-2Zm1 4v-3H3v3h2Zm7-8h3V4h-3v2Zm-1-4v3h2V2h-2Zm0 3v6h2V5h-2Zm-9 6V2H0v9h2ZM4 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM6 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM8 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
              className="icon-dark"
            />
          </svg>
          <span>
            {injectForActiveTab
              ? "Remove from active tab"
              : "Inject into active tab"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Main;
