import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginPending, loginSuccess } from "../redux/slice";
import { selectIsLoggedIn } from "../redux/selectors";
import Input from "./Input";
import Button from "./Button";
import Link from "./Link";
import Icon from "./Icon";
import Spinner from "./Spinner";
import Header from "./Header";

const _fetch = (url: string, config: RequestInit): Response => {
  const { email_address, password } = JSON.parse(config.body as string);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email_address === "test@mike.com") {
        resolve({
          json: () => {
            return new Promise((res, rej) => {
              res({
                email_address: "mike@test.com",
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
      <div className="mb-4">
        <Header />
      </div>
      <div className="mb-4">
        <Input
          placeholder="Email address"
          disabled={isLoading}
          value={email_address}
          onChange={({ target: { value } }) => setEmailAddress(value)}
        />
      </div>
      <div className="mb-4">
        <Input
          placeholder="Password"
          disabled={isLoading}
          type="password"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            disabled={isLoading || !email_address || !password}
            onClick={login}
          >
            Login
          </Button>
          {isLoading && (
            <div className="ml-4">
              <Spinner />
            </div>
          )}
        </div>
        <div>
          <Link target="_blank" href="https://www.google.com">
            Don't have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
