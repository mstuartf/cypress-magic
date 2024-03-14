import { useMutateObserver } from "@rc-component/mutate-observer";

export const useNewToast = () => {
  useMutateObserver(
    document.getElementById("__widget__")!,
    (mutations, observer) => {
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
