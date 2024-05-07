import AssertionOption from "./AssertionOption";

interface Props {
  tagName: string;
  innerText?: string;
  value?: HTMLInputElement["value"];
  classList: string[];
  onHaveText: (text: string) => void;
  onHaveValue: (value: string) => void;
  onHaveClass: (className: string) => void;
  onBeVisible: () => void;
  onClose: () => void;
}

const AssertionOptions = ({
  tagName,
  innerText,
  value,
  classList,
  onHaveClass,
  onHaveValue,
  onHaveText,
  onBeVisible,
  onClose,
}: Props) => (
  <div
    className="cyw-bg-white cyw-rounded cyw-text-sm cyw-shadow-lg cyw-border"
    style={{ width: "175px" }}
  >
    <div className="cyw-bg-emerald-500 cyw-text-white cyw-flex cyw-items-center cyw-justify-between cyw-px-2 cyw-py-2 cyw-rounded-t">
      <div className="">
        <span>Add Assertion</span>
      </div>
      <div className="cyw-ml-4">
        <button onClick={onClose} className="close">
          ×
        </button>
      </div>
    </div>
    <div className="cyw-px-2 cyw-py-2 cyw-border-b cyw-italic">
      expect{" "}
      <code className="cyw-lowercase cyw-font-semibold">&lt;{tagName}&gt;</code>{" "}
      to
    </div>
    <div className="assertions-list">
      {!!innerText && (
        <AssertionOption
          label="have text"
          options={[innerText]}
          onOptionClick={onHaveText}
        />
      )}
      {value !== undefined && (
        <AssertionOption
          label="have value"
          options={[value]}
          onOptionClick={onHaveValue}
        />
      )}
      {!!classList.length &&
        !(classList.length === 1 && classList[0] === "") && (
          <AssertionOption
            label="have class"
            options={classList}
            onOptionClick={onHaveClass}
          />
        )}
      <button
        className="cyw-px-2 cyw-py-2 hover:cyw-bg-gray-200 cyw-block cyw-w-full cyw-text-left"
        onClick={onBeVisible}
      >
        <div className="cyw-flex cyw-items-center cyw-justify-between">
          <span className="cyw-font-bold">be visible</span>
        </div>
      </button>
    </div>
  </div>
);

export default AssertionOptions;
