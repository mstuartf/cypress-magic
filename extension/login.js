const button = document.querySelector("button");
const emailAddress = document.querySelector("input[type=email]");
const password = document.querySelector("input[type=password]");

const _fetch = (url, config) => {
  const { emailAddress, password } = JSON.parse(config.body);
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
  });
};

const loginRequest = async (emailAddress, password) => {
  const response = await _fetch("todo: login url", {
    method: "POST",
    body: JSON.stringify({ emailAddress, password }),
  });
  const body = await response.json();
  return body;
};

const setLoadingState = (isLoading) => {
  [button, emailAddress, password].forEach((el) => {
    el.disabled = isLoading;
  });
};

button.addEventListener("click", async () => {
  setLoadingState(true);
  try {
    const payload = await loginRequest(emailAddress.value, password.value);
    await chrome.runtime.sendMessage(
      {
        type: "login",
        payload,
      },
      () => {
        window.location.replace("./record.html");
      }
    );
  } catch {
    setLoadingState(false);
  }
});
