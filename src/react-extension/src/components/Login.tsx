import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginPending,
  loginSuccess,
  selectIsLoggedIn,
} from "../chrome/background";

const _fetch = (url: string, config: RequestInit): Response => {
  const { email_address, password } = JSON.parse(config.body as string);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email_address === "test@mike.com") {
        resolve({
          json: () => {
            return new Promise((res, rej) => {
              res({
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

const loginRequest = async (email_address: string, password: string) => {
  const response = await _fetch("todo: login url", {
    method: "POST",
    body: JSON.stringify({ email_address, password }),
  });
  const body = await response.json();
  return body;
};

const Login = () => {
  const [email_address, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  if (isLoggedIn) {
    return <Redirect to="/record" />;
  }

  const login = async () => {
    dispatch(loginPending());
    setIsLoading(true);
    const { client_id, token } = await loginRequest(email_address, password);
    setIsLoading(false);
    dispatch(
      loginSuccess({
        email_address,
        client_id,
        token,
      })
    );
  };
  return (
    <div>
      <div>Login</div>
      <label>
        Email address
        <input
          disabled={isLoading}
          value={email_address}
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
    </div>
  );
};

export default Login;
