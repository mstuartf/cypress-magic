const button = document.querySelector("button");
const emailAddress = document.querySelector("input[type=email]");
const password = document.querySelector("input[type=password]");

button.addEventListener("click", async () => {
  await chrome.runtime.sendMessage(
    {
      action: "login",
      data: {
        emailAddress: emailAddress.value,
        password: password.value,
      },
    },
    () => {
      window.location.replace("./record.html");
    }
  );
});
