import { useState } from "react";
import { useMutateObserver } from "@rc-component/mutate-observer";
import { add } from "husky";

export const useNewToast = () => {
  useMutateObserver(
    document.getElementById("__widget__")!,
    (mutations, observer) => {
      console.log(mutations);
      console.log(observer);
      const added = mutations.find(
        ({ addedNodes }) =>
          addedNodes.length &&
          Array.prototype.slice
            .call(addedNodes)
            .find((node) => node.classList.contains("Toastify__toast"))
      );
      if (added) {
        scrollToastContainer();
      }
    }
  );
};

const scrollToastContainer = () => {
  const toastContainer = document.getElementById("my-toaster")!;
  if (toastContainer.children.length) {
    toastContainer.children[0].scrollTop =
      toastContainer.children[0].scrollHeight;
  }
};
