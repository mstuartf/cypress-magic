const BASE_URL = "http://127.0.0.1:1337";

export const loginRequest = async (
  username: string,
  password: string
): Promise<{ token: string }> => {
  const response = await fetch(`${BASE_URL}/accounts/api-token-auth/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const body = await response.json();
  return body;
};

export const getUserRequest = async (
  token: string
): Promise<{ username: string; user_profile: { client_id: string } }> => {
  const response = await fetch(`${BASE_URL}/accounts/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const body = await response.json();
  return body;
};

export const sessionUrlRequest = async (
  session_id: string
): Promise<{ url: string }> => {
  const response = await fetch(
    `https://api.seasmoke.io/events/session/${session_id}/test-file`
  );
  const body = await response.json();
  return body;
};
