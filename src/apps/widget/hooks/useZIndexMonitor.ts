import { useMutateObserver } from "@rc-component/mutate-observer";
import { useState } from "react";
import { maxZIndex } from "../AddAssertion";

export const useZIndexMonitor = () => {
  const [highest, setHighest] = useState(0);
  useMutateObserver(document.body, (mutations, observer) => {
    setHighest(maxZIndex());
  });
  return highest;
};
