import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginPending, loginSuccess } from "../redux/slice";
import { selectToken } from "../redux/selectors";
import Input from "./Input";
import Button from "./Button";
import Link from "./Link";
import Spinner from "./Spinner";
import Header from "./Header";
import { loginRequest } from "../requests";

const Login = () => {
  const [email_address, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const token = useSelector(selectToken);
  if (!!token) {
    return <Redirect to="/record" />;
  }

  const login = async () => {
    dispatch(loginPending());
    setIsLoading(true);
    const { token } = await loginRequest(email_address, password);
    setIsLoading(false);
    dispatch(loginSuccess({ token }));
  };

  return (
    <div>
      <Header />
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
