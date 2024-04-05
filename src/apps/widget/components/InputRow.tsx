import React from "react";

const InputRow = ({
  value,
  placeholder,
  setValue,
  info,
  label,
  required,
}: {
  value?: string;
  label: string;
  placeholder: string;
  info: string;
  setValue: (v: string) => void;
  required?: boolean;
}) => (
  <div className="cyw-w-full cyw-mb-6">
    <label className="cyw-uppercase cyw-tracking-wide cyw-text-xs cyw-font-bold cyw-mb-2 cyw-flex cyw-justify-between">
      <span>{label}</span>
      {required && <span className="cyw-text-xs cyw-font-light">required</span>}
    </label>
    <input
      value={value}
      onChange={({ target: { value } }) => setValue(value)}
      className="cyw-text-xs cyw-appearance-none block cyw-w-full cyw-bg-gray-900 cyw-text-slate-100 cyw-border cyw-rounded cyw-py-3 cyw-px-4 cyw-mb-3 cyw-leading-tight focus:cyw-outline-none focus:cyw-bg-gray-700"
      type="text"
      placeholder={placeholder}
    />
    <p className="cyw-text-xs cyw-italic">{info}</p>
  </div>
);

export default InputRow;
