import React, { useState } from "react";
import { Link } from "react-router-dom";

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

const Login = () => {
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    setIsLoading(true);
    const res = await loginRequest(emailAddress, password);
    setIsLoading(false);
  };
  return (
    <div>
      <div>Login</div>
      <label>
        Email address
        <input
          disabled={isLoading}
          value={emailAddress}
          onChange={({ target: { value } }) => setEmailAddress(value)}
        />
      </label>
      <label>
        Password
        <input
          disabled={isLoading}
          type="password"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
        />
      </label>
      <button disabled={isLoading} onClick={login}>
        Submit
      </button>
      <Link to="/record">got to record</Link>
    </div>
  );
};

export default Login;
