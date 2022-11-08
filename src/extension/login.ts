import { Msg } from "./shared/messaging";

const button: HTMLButtonElement = document.querySelector("button");
const emailAddress: HTMLInputElement =
  document.querySelector("input[type=email]");
const password: HTMLInputElement = document.querySelector(
  "input[type=password]"
);

const sendMsgToContent = (msg: Msg) => {};
const sendMsgToBackground = async (msg: Msg, callback?: (res: any) => void) => {
  await chrome.runtime.sendMessage(msg, callback);
};

const _fetch = (url: string, config: RequestInit): Response => {
  const { emailAddress, password } = JSON.parse(config.body as string);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (emailAddress === "test@mike.com") {
        resolve({
          json: () => {
            return new Promise((res, rej) => {
              res({
                email_address: emailAddress,
                client_id: "b7483b7f-bb53-4190-b9c9-8f01dbd29590",
                token: "ABC!@£",
              });
            });
          },
        });
      } else {
        reject("invalid credentials");
      }
    }, 2000);
  }) as unknown as Response;
};

const loginRequest = async (emailAddress: string, password: string) => {
  const response = await _fetch("todo: login url", {
    method: "POST",
    body: JSON.stringify({ emailAddress, password }),
  });
  const body = await response.json();
  return body;
};

const setLoadingState = (isLoading: boolean) => {
  [button, emailAddress, password].forEach((el) => {
    el.disabled = isLoading;
  });
};

button.addEventListener("click", async () => {
  setLoadingState(true);
  try {
    const payload = await loginRequest(emailAddress.value, password.value);
    await sendMsgToBackground(
      {
        type: "login",
        payload,
        meta: { from: "popup", to: "background" },
      },
      () => {
        window.location.replace("./record.html");
      }
    );
  } catch {
    setLoadingState(false);
  }
});
