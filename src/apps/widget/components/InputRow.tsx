import React from "react";

const InputRow = ({
  value,
  placeholder,
  setValue,
  info,
  label,
}: {
  value?: string;
  label: string;
  placeholder: string;
  info: string;
  setValue: (v: string) => void;
}) => (
  <div className="cyw-w-full cyw-mb-6">
    <label className="cyw-block cyw-uppercase cyw-tracking-wide cyw-text-gray-700 cyw-text-xs cyw-font-bold cyw-mb-2">
      {label}
    </label>
    <input
      value={value}
      onChange={({ target: { value } }) => setValue(value)}
      className="cyw-text-xs cyw-appearance-none block cyw-w-full cyw-bg-gray-200 cyw-text-gray-700 cyw-border cyw-rounded cyw-py-3 cyw-px-4 cyw-mb-3 cyw-leading-tight focus:cyw-outline-none focus:cyw-bg-white"
      type="text"
      placeholder={placeholder}
    />
    <p className="cyw-text-gray-600 cyw-text-xs cyw-italic">{info}</p>
  </div>
);

export default InputRow;
