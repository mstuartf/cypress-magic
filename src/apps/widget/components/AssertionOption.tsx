interface Props {
  label: string;
  options: string[];
  onOptionClick: (value: string) => void;
}

const AssertionOption = ({ label, options, onOptionClick }: Props) => (
  <div className="hover:cyw-bg-gray-200 cyw-group cyw-relative">
    <div className="cyw-px-2 cyw-py-2 cyw-flex cyw-items-center cyw-justify-between">
      <span>{label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </div>
    <div className="group-hover:cyw-block cyw-hidden cyw-absolute cyw-left-full cyw-top-0 bg-white cyw-border cyw-rounded cyw-max-w-lg">
      {options.map((option) => (
        <button
          onClick={() => onOptionClick(option)}
          className="cyw-px-2 cyw-py-2 hover:cyw-bg-gray-200 cyw-text-left cyw-w-full cyw-block"
        >
          {option === "" ? `""` : option}
        </button>
      ))}
    </div>
  </div>
);

export default AssertionOption;
